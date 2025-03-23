import React, { useState, useRef } from "react";
import axios from "axios";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  RadialLinearScale, 
  PointElement, 
  LineElement 
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  RadialLinearScale, 
  PointElement, 
  LineElement
);

const LOCATIONIQ_API_KEY = "pk.ec26d8ea85c97481bea9f26291756aee";
const WEATHERBIT_API_KEY = "36ab765d0976459c80970b2ebefb2db1";

// Soil fertility ratings lookup
const SOIL_RATINGS = {
  // Indian soil types
  "Alluvial Soil": 95, "Black Soil": 85, "Red Soil": 65, "Laterite Soil": 45,
  "Desert Soil": 25, "Forest Soil": 70, "Mountain Soil": 55, "Saline Soil": 15,
  // Standard soil taxonomy
  "Mollisols": 90, "Vertisols": 85, "Inceptisols": 75, "Andisols": 80,
  "Alfisols": 70, "Entisols": 65, "Ultisols": 50, "Oxisols": 40,
  "Podzols": 30, "Aridisols": 20, "Histosols": 60
};

// State-based adjustments for agricultural potential
const STATE_ADJUSTMENTS = {
  "Punjab": { soil: 95, water: 15, potential: 10 },
  "Haryana": { soil: 90, water: 15, potential: 8 },
  "Uttar Pradesh": { soil: 85, water: 10, potential: 7 },
  "West Bengal": { soil: 80, water: 10, potential: 6 },
  "Kerala": { soil: 75, water: 5, potential: 5 },
  "Karnataka": { soil: 70, water: -5, potential: 4 },
  "Tamil Nadu": { soil: 65, water: 5, potential: 5 },
  "Andhra Pradesh": { soil: 65, water: 0, potential: 4 },
  "Telangana": { soil: 60, water: -5, potential: 3 },
  "Maharashtra": { soil: 60, water: -10, potential: 2 },
  "Gujarat": { soil: 50, water: -5, potential: 2 },
  "Rajasthan": { soil: 30, water: -15, potential: -5 },
  "Madhya Pradesh": { soil: 55, water: -5, potential: 3 },
  "Bihar": { soil: 75, water: 5, potential: 5 },
  "Assam": { soil: 75, water: 5, potential: 6 }
};

const LoanScoreCalculator = () => {
  const [place, setPlace] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const gaugeCanvasRef = useRef(null);

  // Helper functions for score calculations
  const rateSoilFertility = (soilType, state) => {
    if (soilType in SOIL_RATINGS) return SOIL_RATINGS[soilType];
    return STATE_ADJUSTMENTS[state]?.soil || 50;
  };
  
  const evaluateClimateStability = (temperature, precipitation) => {
    let tempScore = 0;
    
    if (temperature >= 20 && temperature <= 30) tempScore = 50;
    else if (temperature > 30 && temperature <= 35) tempScore = 40;
    else if (temperature > 35) tempScore = 25;
    else if (temperature >= 15 && temperature < 20) tempScore = 45;
    else if (temperature >= 10 && temperature < 15) tempScore = 30;
    else tempScore = 20;
    
    let precipScore = 0;
    if (precipitation <= 5) precipScore = 10;
    else if (precipitation <= 20) precipScore = 20;
    else if (precipitation <= 50) precipScore = 35;
    else if (precipitation <= 100) precipScore = 45;
    else if (precipitation <= 200) precipScore = 40;
    else precipScore = 30;
    
    return Math.min(100, tempScore + precipScore);
  };
  
  const evaluateWaterAvailability = (precipitation, state) => {
    let baseScore = 0;
    
    if (precipitation >= 100) baseScore = 90;
    else if (precipitation >= 50) baseScore = 80;
    else if (precipitation >= 30) baseScore = 70;
    else if (precipitation >= 20) baseScore = 60;
    else if (precipitation >= 10) baseScore = 40;
    else baseScore = 20;
    
    const adjustment = STATE_ADJUSTMENTS[state]?.water || 0;
    return Math.max(0, Math.min(100, baseScore + adjustment));
  };

  const calculateCreditScore = (soilType, weatherData, state) => {
    const soilFertility = rateSoilFertility(soilType, state);
    const climateStability = evaluateClimateStability(weatherData.temperature, weatherData.precipitation);
    const waterAvailability = evaluateWaterAvailability(weatherData.precipitation, state);
    const regionalBonus = STATE_ADJUSTMENTS[state]?.potential || 0;
    
    // Calculate base score with weights
    const baseScore = Math.round(
      0.4 * soilFertility + 0.3 * climateStability + 0.3 * waterAvailability
    );
    
    // Apply regional adjustment
    return Math.max(0, Math.min(100, baseScore + regionalBonus));
  };
  
  // Fetch location, soil type, and weather data
  const fetchLoanScore = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      // Get Latitude & Longitude
      const locationRes = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${place}, India&format=json`
      );
      
      const lat = parseFloat(locationRes.data[0].lat);
      const lon = parseFloat(locationRes.data[0].lon);
      
      // Get detailed address info including state
      const reverseGeoRes = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      
      const state = reverseGeoRes.data.address.state || "";
      
      // Get Soil Data
      const soilRes = await axios.get(`https://api.openepi.io/soil/type?lat=${lat}&lon=${lon}`);
      const soilType = soilRes.data.properties.most_probable_soil_type;

      // Get Weather Data
      const weatherRes = await axios.get(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`
      );
      
      const temp = parseFloat(weatherRes.data.data[0].temp);
      const precip = parseFloat(weatherRes.data.data[0].precip);

      // Calculate scores
      const soilFertility = rateSoilFertility(soilType, state);
      const climateStability = evaluateClimateStability(temp, precip);
      const waterAvailability = evaluateWaterAvailability(precip, state);
      const creditScore = calculateCreditScore(soilType, { temperature: temp, precipitation: precip }, state);
      
      // Set data
      setData({
        place,
        latitude: lat,
        longitude: lon,
        state,
        soilType,
        temperature: temp,
        precipitation: precip,
        creditScore,
        soilFertility,
        climateStability,
        waterAvailability,
        soilContribution: Math.round(soilFertility * 0.4),
        climateContribution: Math.round(climateStability * 0.3),
        waterContribution: Math.round(waterAvailability * 0.3),
        regionalAdjustment: creditScore - Math.round(soilFertility * 0.4 + climateStability * 0.3 + waterAvailability * 0.3)
      });

    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch data. Check API keys and location data.");
    } finally {
      setLoading(false);
    }
  };

  // Add score text to gauge chart after rendering
  const drawScoreText = () => {
    if (gaugeCanvasRef.current && data) {
      const ctx = gaugeCanvasRef.current.getContext('2d');
      const centerX = gaugeCanvasRef.current.width / 2;
      const centerY = gaugeCanvasRef.current.height - 30;
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = getScoreColor(data.creditScore);
      ctx.fillText(`${data.creditScore}`, centerX, centerY);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText('/100', centerX + 25, centerY);
      
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText('Loan Score', centerX, centerY - 30);
    }
  };

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "#4CAF50"; // Green
    if (score >= 65) return "#8BC34A"; // Light Green
    if (score >= 50) return "#FFC107"; // Amber
    if (score >= 35) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  // Get recommendation based on score
  const getLoanRecommendation = (score) => {
    if (score >= 80) {
      return "Excellent agricultural potential. Eligible for premium loan packages.";
    } else if (score >= 65) {
      return "Good agricultural potential. Eligible for standard agricultural loans.";
    } else if (score >= 50) {
      return "Fair agricultural potential. May qualify for basic loans with requirements.";
    } else if (score >= 35) {
      return "Limited agricultural potential. Consider specialized programs.";
    } else {
      return "Poor agricultural potential. Traditional loans unlikely. Explore alternatives.";
    }
  };

  // Prepare chart data
  const radarData = data ? {
    labels: ['Soil Fertility', 'Climate Stability', 'Water Availability'],
    datasets: [{
      label: 'Agricultural Factors',
      data: [data.soilFertility, data.climateStability, data.waterAvailability],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
    }]
  } : null;

  const barData = data ? {
    labels: ['Soil (40%)', 'Climate (30%)', 'Water (30%)'],
    datasets: [
      {
        label: 'Raw Score',
        data: [data.soilFertility, data.climateStability, data.waterAvailability],
        backgroundColor: ['rgba(76, 175, 80, 0.7)', 'rgba(33, 150, 243, 0.7)', 'rgba(3, 169, 244, 0.7)'],
      },
      {
        label: 'Contribution to Final Score',
        data: [data.soilContribution, data.climateContribution, data.waterContribution],
        backgroundColor: ['rgba(76, 175, 80, 0.3)', 'rgba(33, 150, 243, 0.3)', 'rgba(3, 169, 244, 0.3)'],
      }
    ]
  } : null;

  const gaugeData = data ? {
    datasets: [{
      data: [data.creditScore, 100 - data.creditScore],
      backgroundColor: [
        data.creditScore >= 80 ? 'rgba(76, 175, 80, 0.8)' : 
        data.creditScore >= 65 ? 'rgba(139, 195, 74, 0.8)' : 
        data.creditScore >= 50 ? 'rgba(255, 193, 7, 0.8)' : 
        data.creditScore >= 35 ? 'rgba(255, 152, 0, 0.8)' : 
        'rgba(244, 67, 54, 0.8)',
        'rgba(220, 220, 220, 0.5)'
      ],
      borderWidth: 0
    }]
  } : null;

  const gaugeOptions = {
    circumference: 180,
    rotation: 270,
    cutout: '70%',
    maintainAspectRatio: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      onComplete: drawScoreText
    },
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false }
    }
  };

  return (
    <div className="loan-calculator" style={{ 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "16px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#2e7d32", fontSize: "24px", margin: "0 0 8px 0" }}>
          India Agricultural Loan Score Calculator
        </h1>
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 16px 0" }}>
          Evaluate loan eligibility based on agricultural factors
        </p>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center",
          gap: "8px",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <input
            type="text"
            placeholder="Enter location in India"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            style={{ 
              flex: "1",
              padding: "10px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "14px"
            }}
          />
          <button 
            onClick={fetchLoanScore} 
            disabled={loading || !place}
            style={{
              padding: "10px 16px",
              backgroundColor: loading ? "#ccc" : "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading || !place ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            {loading ? "Processing..." : "Calculate"}
          </button>
        </div>
        
        {error && (
          <div style={{ 
            color: "white", 
            backgroundColor: "#f44336",
            padding: "8px 12px",
            borderRadius: "4px",
            marginTop: "12px",
            display: "inline-block",
            fontSize: "14px"
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {data && (
        <div style={{ animation: "fadeIn 0.5s" }}>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "16px"
          }}>
            {/* Location Info Card */}
            <div style={{ 
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ fontSize: "16px", color: "#333", margin: "0 0 12px 0" }}>Location Details</h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "auto 1fr",
                gap: "6px",
                fontSize: "14px",
                lineHeight: "1.4"
              }}>
                <div style={{ fontWeight: "600", color: "#555" }}>State:</div>
                <div>{data.state || "Unknown"}</div>
                
                <div style={{ fontWeight: "600", color: "#555" }}>Coordinates:</div>
                <div>{data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</div>
                
                <div style={{ fontWeight: "600", color: "#555" }}>Soil Type:</div>
                <div>{data.soilType}</div>
                
                <div style={{ fontWeight: "600", color: "#555" }}>Temperature:</div>
                <div>{data.temperature.toFixed(1)}°C</div>
                
                <div style={{ fontWeight: "600", color: "#555" }}>Precipitation:</div>
                <div>{data.precipitation.toFixed(1)} mm</div>
              </div>
            </div>
            
            {/* Gauge Chart Card */}
            <div style={{ 
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div style={{ height: "150px" }}>
                <canvas ref={gaugeCanvasRef}>
                  {gaugeData && <Doughnut data={gaugeData} options={gaugeOptions} />}
                </canvas>
              </div>
              
              <div style={{
                padding: "12px",
                backgroundColor: `rgba(${getScoreColor(data.creditScore).replace(/[^\d,]/g, '')},0.1)`,
                borderLeft: `3px solid ${getScoreColor(data.creditScore)}`,
                borderRadius: "4px",
                marginTop: "10px",
                fontSize: "13px"
              }}>
                {getLoanRecommendation(data.creditScore)}
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "16px"
          }}>
            {/* Radar Chart */}
            <div style={{ 
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ fontSize: "16px", color: "#333", margin: "0 0 12px 0" }}>Agricultural Potential Factors</h3>
              <div style={{ height: "200px" }}>
                {radarData && (
                  <Radar 
                    data={radarData} 
                    options={{
                      scales: {
                        r: {
                          suggestedMin: 0,
                          suggestedMax: 100
                        }
                      },
                      maintainAspectRatio: false
                    }} 
                  />
                )}
              </div>
            </div>
            
            {/* Bar Chart */}
            <div style={{ 
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ fontSize: "16px", color: "#333", margin: "0 0 12px 0" }}>Score Breakdown</h3>
              <div style={{ height: "200px" }}>
                {barData && (
                  <Bar 
                    data={barData} 
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Score Calculation Summary */}
          <div style={{ 
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: "16px", color: "#333", margin: "0 0 12px 0" }}>Score Calculation</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #eee" }}>Factor</th>
                  <th style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>Score</th>
                  <th style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>Weight</th>
                  <th style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Soil Fertility</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>{data.soilFertility}</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>40%</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>{data.soilContribution}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Climate Stability</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>{data.climateStability}</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>30%</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>{data.climateContribution}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Water Availability</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>{data.waterAvailability}</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>30%</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>{data.waterContribution}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Base Score</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee", fontWeight: "bold" }} colSpan="2">
                    {data.soilContribution + data.climateContribution + data.waterContribution}
                  </td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}></td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Regional Adjustment</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee", fontWeight: "bold" }} colSpan="2">
                    {data.regionalAdjustment > 0 ? `+${data.regionalAdjustment}` : data.regionalAdjustment}
                  </td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}></td>
                </tr>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Final Loan Score</td>
                  <td style={{ padding: "8px", textAlign: "center", fontWeight: "bold", color: getScoreColor(data.creditScore) }} colSpan="2">
                    {data.creditScore}/100
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanScoreCalculator;