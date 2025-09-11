#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Qisya";
const char* password = "vitaqisya18";

// Supabase configuration - URL sudah disesuaikan dengan project Anda
const char* supabaseUrl = "https://sotmyfumfmuvzewoezhp.supabase.co";
const char* supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvdG15ZnVtZm11dnpld29lemhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDEyNzEsImV4cCI6MjA3MzA3NzI3MX0._nZexm7pdedOzO9zPNp9xNyvLtaJd0K-_THkwcO7Kzs";
const char* functionUrl = "https://sotmyfumfmuvzewoezhp.supabase.co/functions/v1/receive-iot-data";

// Location data
const char* lokasi = "Jl. MT Haryono";
const char* kota = "Balikpapan Kota";
float latitude = -1.2445;
float longitude = 116.8398;

// Sensor configuration
const int piezoPin = 34; // GPIO for piezo sensor (ADC input)
int sensorValue = 0;

// Processed data variables
float energiHarian = 0.0;     // in kWh
int efisiensi = 0;            // in percent
int pejalanKakiPerHari = 0;  

// Timing variables
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 60000; // Send every 60 seconds

// Function to process piezo sensor data
void prosesDataSensor(int sensorVal) {
  // Enhanced processing logic
  // Convert sensor reading to energy (adjust formula based on your calibration)
  energiHarian = (sensorVal / 4095.0) * 0.1; // Scale 0-0.1 kWh based on max ADC value
  
  // Calculate efficiency based on sensor performance
  efisiensi = 80 + (sensorVal % 20); // Efficiency between 80-99%
  
  // Estimate pedestrian count (adjust based on your sensor calibration)
  pejalanKakiPerHari = (sensorVal > 100) ? (sensorVal / 50) : 0; // Only count significant readings
  
  // Add some noise filtering
  if (sensorVal < 50) {
    energiHarian = 0.0;
    pejalanKakiPerHari = 0;
    efisiensi = 0;
  }
}

// Function to send data to Supabase
bool sendDataToSupabase() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return false;
  }

  HTTPClient http;
  http.begin(functionUrl);
  
  // Set headers for Supabase authentication
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseAnonKey);
  http.addHeader("Authorization", String("Bearer ") + supabaseAnonKey);
  
  // Create JSON payload
  StaticJsonDocument<512> jsonDoc;
  jsonDoc["lokasi"] = lokasi;
  jsonDoc["kota"] = kota;
  jsonDoc["energiHarian"] = energiHarian;
  jsonDoc["efisiensi"] = efisiensi;
  jsonDoc["pejalanKakiPerHari"] = pejalanKakiPerHari;
  jsonDoc["latitude"] = latitude;
  jsonDoc["longitude"] = longitude;
  
  String requestBody;
  serializeJson(jsonDoc, requestBody);
  
  Serial.println("Sending data:");
  Serial.println(requestBody);
  
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("HTTP Response: %d\n", httpResponseCode);
    Serial.println("Response: " + response);
    
    if (httpResponseCode == 200) {
      Serial.println("✓ Data sent successfully!");
      http.end();
      return true;
    }
  } else {
    Serial.printf("✗ Error sending POST: %d\n", httpResponseCode);
  }
  
  http.end();
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== Piezoelectric IoT Sensor ===");
  Serial.printf("Location: %s, %s\n", lokasi, kota);
  Serial.printf("Coordinates: %.4f, %.4f\n", latitude, longitude);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    Serial.print(".");
    delay(1000);
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ Connected to WiFi!");
    Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n✗ Failed to connect to WiFi");
  }
  
  Serial.println("System ready. Starting data collection...\n");
}

void loop() {
  // Read piezo sensor
  sensorValue = analogRead(piezoPin);
  
  // Process sensor data
  prosesDataSensor(sensorValue);
  
  // Print current readings
  Serial.printf("Sensor: %d | Energy: %.4f kWh | Efficiency: %d%% | Pedestrians: %d\n", 
                sensorValue, energiHarian, efisiensi, pejalanKakiPerHari);
  
  // Send data at specified intervals
  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= sendInterval) {
    Serial.println("\n--- Sending data to server ---");
    
    if (sendDataToSupabase()) {
      lastSendTime = currentTime;
    } else {
      Serial.println("Failed to send data, will retry next cycle");
    }
    
    Serial.println("--------------------------------\n");
  }
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, attempting reconnection...");
    WiFi.begin(ssid, password);
    delay(5000);
  }
  
  delay(5000); // Read sensor every 5 seconds
}