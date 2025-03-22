import React, { useState } from "react";
import axios from "axios";

const LOCATIONIQ_API_KEY = "pk.ec26d8ea85c97481bea9f26291756aee";
const WEATHERBIT_API_KEY = "36ab765d0976459c80970b2ebefb2db1";

const LoanScoreCalculator = () => {
  const [place, setPlace] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Enhanced soil fertility rating for India's diverse soil types
  const rateSoilFertility = (soilType, state = "") => {
    // Primary classification based on standard soil taxonomy
    const baseFertilityScores = {
      Mollisols: 90, 
      Vertisols: 85, // Black cotton soils
      Inceptisols: 75,
      Andisols: 80, 
      Alfisols: 70, 
      Entisols: 65, // Young soils, often in floodplains
      Ultisols: 50, 
      Oxisols: 40, 
      Podzols: 30, 
      Aridisols: 20,
      Histosols: 60, // Organic soils
    };
    
    // Regional soil adjustments for India
    const indianSoilTypes = {
      "Alluvial Soil": 95, // Indo-Gangetic plains (Punjab, UP, etc.)
      "Black Soil": 85,    // Deccan plateau (Maharashtra, parts of MP)
      "Red Soil": 65,      // Southern peninsular (Tamil Nadu, parts of Karnataka)
      "Laterite Soil": 45, // Kerala, parts of Eastern India
      "Desert Soil": 25,   // Rajasthan
      "Forest Soil": 70,   // Northeast regions
      "Mountain Soil": 55, // Himalayan regions
      "Saline Soil": 15,   // Coastal areas and parts of Gujarat
    };
    
    // Check if we have an India-specific soil classification first
    if (soilType in indianSoilTypes) {
      return indianSoilTypes[soilType];
    }
    
    // State-based adjustments if official soil type is not recognized
    if (!baseFertilityScores.hasOwnProperty(soilType) && state) {
      const stateSoilMap = {
        "Punjab": 95,
        "Haryana": 90,
        "Uttar Pradesh": 85,
        "West Bengal": 80,
        "Kerala": 75,
        "Karnataka": 70,
        "Tamil Nadu": 65,
        "Andhra Pradesh": 65,
        "Telangana": 60,
        "Maharashtra": 60,
        "Madhya Pradesh": 55,
        "Gujarat": 50,
        "Rajasthan": 30,
        "Jammu and Kashmir": 50,
        "Himachal Pradesh": 55,
        "Uttarakhand": 60,
        "Assam": 75,
        "Meghalaya": 70,
        "Tripura": 70,
        "Manipur": 65,
        "Nagaland": 65,
        "Mizoram": 65,
        "Arunachal Pradesh": 60,
        "Chhattisgarh": 55,
        "Jharkhand": 50,
        "Odisha": 60,
        "Bihar": 75,
        "Sikkim": 65,
        "Goa": 70,
      };
      
      return stateSoilMap[state] || 50; // Default to 50 if state not found
    }
    
    // Fall back to standard soil taxonomy
    if (baseFertilityScores.hasOwnProperty(soilType)) {
      return baseFertilityScores[soilType];
    }
    
    console.warn(`Unknown soil type: ${soilType}`);
    return 50; // Default middle fertility
  };
  
  // Enhanced climate stability evaluation for Indian conditions
  const evaluateClimateStability = (temperature, precipitation) => {
    // Base score from temperature
    let score = 0;
    
    // Temperature scoring (adjusted for Indian climate)
    if (temperature >= 20 && temperature <= 30) {
      // Ideal temperature range for most crops
      score += 50;
    } else if (temperature > 30 && temperature <= 35) {
      // Hot but manageable
      score += 40;
    } else if (temperature > 35 && temperature <= 40) {
      // Very hot, challenging for many crops
      score += 25;
    } else if (temperature > 40) {
      // Extremely hot, limiting for most crops
      score += 15;
    } else if (temperature >= 15 && temperature < 20) {
      // Cool but good for some crops
      score += 45;
    } else if (temperature >= 10 && temperature < 15) {
      // Cold, limiting for many tropical crops
      score += 30;
    } else {
      // Very cold, significant limitations
      score += 20;
    }
    
    // Adjust for seasonal monsoon patterns using precipitation
    if (precipitation <= 5) {
      // Drought conditions
      score += 10;
    } else if (precipitation > 5 && precipitation <= 20) {
      // Low rainfall
      score += 20;
    } else if (precipitation > 20 && precipitation <= 50) {
      // Moderate rainfall
      score += 35;
    } else if (precipitation > 50 && precipitation <= 100) {
      // Good rainfall
      score += 45;
    } else if (precipitation > 100 && precipitation <= 200) {
      // High rainfall
      score += 40; // Slightly lower as it can cause issues
    } else {
      // Excessive rainfall (flooding risk)
      score += 30;
    }
    
    // Return average of temperature and precipitation scores
    return Math.min(100, Math.round(score)); // Cap at 100
  };
  
  // Enhanced water availability evaluation
  const evaluateWaterAvailability = (precipitation, state = "") => {
    // Base score from precipitation
    let baseScore = 0;
    
    // Precipitation scoring
    if (precipitation >= 100) {
      baseScore = 90; // Excellent precipitation
    } else if (precipitation >= 50) {
      baseScore = 80; // Very good precipitation
    } else if (precipitation >= 30) {
      baseScore = 70; // Good precipitation
    } else if (precipitation >= 20) {
      baseScore = 60; // Moderate precipitation
    } else if (precipitation >= 10) {
      baseScore = 40; // Low precipitation
    } else {
      baseScore = 20; // Very low precipitation
    }
    
    // Adjust based on known irrigation/water infrastructure by state
    const stateWaterAdjustment = {
      "Punjab": 15, // Excellent irrigation infrastructure
      "Haryana": 15,
      "Uttar Pradesh": 10,
      "Bihar": 5,
      "West Bengal": 10,
      "Assam": 5,
      "Kerala": 5,
      "Tamil Nadu": 5,
      "Andhra Pradesh": 0,
      "Telangana": -5,
      "Karnataka": -5,
      "Maharashtra": -10,
      "Gujarat": -5,
      "Rajasthan": -15, // Poor water resources
      "Madhya Pradesh": -5,
      "Chhattisgarh": 0,
      "Odisha": 5,
      "Jharkhand": -5,
      "Uttarakhand": 10,
      "Himachal Pradesh": 10,
      "Jammu and Kashmir": 5,
      "Northeast": 10, // Generally good water resources
    };
    
    // Apply state-based adjustment if available
    const adjustment = stateWaterAdjustment[state] || 0;
    
    // Calculate final score and ensure it's within 0-100 range
    return Math.max(0, Math.min(100, baseScore + adjustment));
  };

  // Enhanced loan score calculation with region-specific factors
  const calculateCreditScore = (soilType, weatherData, state = "") => {
    const soilFertility = rateSoilFertility(soilType, state);
    const climateStability = evaluateClimateStability(weatherData.temperature, weatherData.precipitation);
    const waterAvailability = evaluateWaterAvailability(weatherData.precipitation, state);
  
    // Add state-specific agricultural potential adjustment
    const stateAgriPotential = {
      "Punjab": 10,
      "Haryana": 8,
      "Uttar Pradesh": 7,
      "West Bengal": 6,
      "Kerala": 5,
      "Karnataka": 4,
      "Tamil Nadu": 5,
      "Andhra Pradesh": 4,
      "Telangana": 3,
      "Maharashtra": 2,
      "Gujarat": 2,
      "Rajasthan": -5,
      "Madhya Pradesh": 3,
      "Chhattisgarh": 2,
      "Bihar": 5,
      "Odisha": 3,
      "Assam": 6,
      "Himachal Pradesh": 4,
      "Uttarakhand": 3,
    };
    
    const regionalBonus = stateAgriPotential[state] || 0;
    
    console.log("Score Components:", { 
      soilFertility, 
      climateStability, 
      waterAvailability, 
      state, 
      regionalBonus 
    });
  
    // Calculate weighted average using percentages with regional adjustment
    const baseScore = Math.round(
      0.4 * soilFertility +      // 40% weight for soil fertility
      0.3 * climateStability +   // 30% weight for climate stability
      0.3 * waterAvailability    // 30% weight for water availability
    );
    
    // Apply regional bonus/penalty and ensure score is within 0-100 range
    return Math.max(0, Math.min(100, baseScore + regionalBonus));
  };
  
  // Extract state from address components
  const extractState = (addressComponents) => {
    if (!addressComponents || !Array.isArray(addressComponents)) {
      return "";
    }
    
    // Try to find state level administrative area
    for (const component of addressComponents) {
      if (component.type === "administrative_area_level_1") {
        return component.long_name;
      }
    }
    
    return "";
  };
  
  // Fetch location, soil type, and weather data
  const fetchLoanScore = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      // 1️⃣ Get Latitude & Longitude
      const locationRes = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${place}, India&format=json`
      );
      
      // Convert lat/lon to numbers from strings - fixing the .toFixed error
      const lat = parseFloat(locationRes.data[0].lat);
      const lon = parseFloat(locationRes.data[0].lon);
      
      // 1.5️⃣ Get detailed address info including state
      const reverseGeoRes = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      
      const state = reverseGeoRes.data.address.state || "";
      
      // 2️⃣ Get Soil Data
      const soilRes = await axios.get(`https://api.openepi.io/soil/type?lat=${lat}&lon=${lon}`);
      const soilType = soilRes.data.properties.most_probable_soil_type;

      // 3️⃣ Get Weather Data
      const weatherRes = await axios.get(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`
      );
      
      // Ensure temperature and precipitation are numbers
      const temp = parseFloat(weatherRes.data.data[0].temp);
      const precip = parseFloat(weatherRes.data.data[0].precip);

      // 4️⃣ Calculate Loan Score
      const creditScore = calculateCreditScore(soilType, { temperature: temp, precipitation: precip }, state);
      
      // Calculate individual components for display
      const soilFertility = rateSoilFertility(soilType, state);
      const climateStability = evaluateClimateStability(temp, precip);
      const waterAvailability = evaluateWaterAvailability(precip, state);
      
      console.log("Fetched Data:", {
        latitude: lat,
        longitude: lon,
        state,
        soilType,
        temperature: temp,
        precipitation: precip,
        creditScore
      });
      
      // 5️⃣ Set Data
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
        waterAvailability
      });

    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch data. Check API keys and limits.");
    } finally {
      setLoading(false);
    }
  };

  // Get background color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "#4CAF50"; // Green
    if (score >= 60) return "#8BC34A"; // Light Green
    if (score >= 40) return "#FFC107"; // Amber
    if (score >= 20) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>India Agricultural Loan Score Calculator</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter location in India"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", width: "250px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={fetchLoanScore} 
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Loading..." : "Get Loan Score"}
        </button>
      </div>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
          <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", textAlign: "center" }}>Results for {data.place}</h3>
            <p><strong>State:</strong> {data.state || "Unknown"}</p>
            <p><strong>Coordinates:</strong> {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</p>
            <p><strong>Soil Type:</strong> {data.soilType}</p>
            <p><strong>Temperature:</strong> {data.temperature.toFixed(1)}°C</p>
            <p><strong>Precipitation:</strong> {data.precipitation.toFixed(1)} mm</p>
            
            <div style={{ 
              backgroundColor: getScoreColor(data.creditScore), 
              color: "white", 
              padding: "15px", 
              borderRadius: "8px", 
              textAlign: "center",
              margin: "15px 0"
            }}>
              <h2 style={{ margin: "0" }}>Loan Score: {data.creditScore} / 100</h2>
            </div>
          </div>
          
          <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
            <h4 style={{ marginTop: "0" }}>Score Breakdown:</h4>
            
            <div>
              <p><strong>Soil Fertility (40%):</strong></p>
              <div style={{ backgroundColor: "#e0e0e0", borderRadius: "4px", height: "20px", position: "relative" }}>
                <div 
                  style={{ 
                    width: `${data.soilFertility}%`, 
                    backgroundColor: "#4CAF50", 
                    height: "100%", 
                    borderRadius: "4px",
                    position: "relative"
                  }}
                >
                  <span style={{ 
                    position: "absolute", 
                    right: "5px", 
                    top: "0", 
                    color: "white", 
                    fontSize: "12px",
                    lineHeight: "20px"
                  }}>
                    {data.soilFertility}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "12px", marginTop: "5px" }}>
                Contribution: {data.soilFertility} × 0.4 = {Math.round(data.soilFertility * 0.4)}
              </p>
            </div>
            
            <div style={{ marginTop: "15px" }}>
              <p><strong>Climate Stability (30%):</strong></p>
              <div style={{ backgroundColor: "#e0e0e0", borderRadius: "4px", height: "20px", position: "relative" }}>
                <div 
                  style={{ 
                    width: `${data.climateStability}%`, 
                    backgroundColor: "#2196F3", 
                    height: "100%", 
                    borderRadius: "4px",
                    position: "relative"
                  }}
                >
                  <span style={{ 
                    position: "absolute", 
                    right: "5px", 
                    top: "0", 
                    color: "white", 
                    fontSize: "12px",
                    lineHeight: "20px"
                  }}>
                    {data.climateStability}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "12px", marginTop: "5px" }}>
                Contribution: {data.climateStability} × 0.3 = {Math.round(data.climateStability * 0.3)}
              </p>
            </div>
            
            <div style={{ marginTop: "15px" }}>
              <p><strong>Water Availability (30%):</strong></p>
              <div style={{ backgroundColor: "#e0e0e0", borderRadius: "4px", height: "20px", position: "relative" }}>
                <div 
                  style={{ 
                    width: `${data.waterAvailability}%`, 
                    backgroundColor: "#03A9F4", 
                    height: "100%", 
                    borderRadius: "4px",
                    position: "relative"
                  }}
                >
                  <span style={{ 
                    position: "absolute", 
                    right: "5px", 
                    top: "0", 
                    color: "white", 
                    fontSize: "12px",
                    lineHeight: "20px"
                  }}>
                    {data.waterAvailability}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "12px", marginTop: "5px" }}>
                Contribution: {data.waterAvailability} × 0.3 = {Math.round(data.waterAvailability * 0.3)}
              </p>
            </div>
            
            <div style={{ marginTop: "15px", borderTop: "1px solid #ccc", paddingTop: "15px" }}>
              <p><strong>Total Base Score:</strong> {Math.round(data.soilFertility * 0.4 + data.climateStability * 0.3 + data.waterAvailability * 0.3)}</p>
              <p><strong>Regional Adjustment:</strong> {data.creditScore - Math.round(data.soilFertility * 0.4 + data.climateStability * 0.3 + data.waterAvailability * 0.3)}</p>
              <p><strong>Final Score:</strong> {data.creditScore}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanScoreCalculator;