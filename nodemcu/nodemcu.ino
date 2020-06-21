#include <ESP8266WiFi.h>
#include <SocketIoClient.h>

#define LDR A0
#define LED1 D5
#define LED2 D7

float lux = 0.00;
float ADC_value= 0.0048828125;
float LDR_value;


const char* ssid = "Bizdev";
const char* password = "pulaukaimana99";

WiFiClient client;
SocketIoClient webSocket;

const char* host = "192.168.1.9"; // IP SERVER
const int port = 5000;
const char* socket_path = "/socket.io/?transport=websocket";

void statusEvent(const char* payload, size_t lenght) {
    int led1on = 0, led2on = 0;
    
    sscanf(payload, "{\"led1on\":%d,\"led2on\":%d}", &led1on, &led2on);
    
    if (led1on) {
        digitalWrite(LED1, HIGH);
    } else {
        digitalWrite(LED1, LOW);
    }
    
    if (led2on) {
        digitalWrite(LED2, HIGH);
    } else {
        digitalWrite(LED2, LOW);
    }
}

void readSensors() {
   int LDR_value = analogRead(A0);   // read the input on analog pin 0

   float voltage = LDR_value * (5.0 / 1023.0);   // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V)
   lux = (250.000000/(ADC_value*LDR_value))-50.000000;

   
    
    if(client.connect(host, port)){
        String postStr = "{\"lux\": \"";
        postStr += lux;
        postStr += "\", \"volt\": \"";
        postStr += voltage;
        postStr += "\"}";

        client.print("POST /api/ldr HTTP/1.1\n");
        client.println("Content-Type: application/json");
        client.print("Content-Length: ");
        client.print(postStr.length());
        client.print("\n\n");
        client.println(postStr);
        client.stop();

        Serial.println("Post\n");
    }
}

void setup() {
    pinMode ( LED1, OUTPUT );
    pinMode ( LED2, OUTPUT );
    pinMode ( LDR, INPUT );

    Serial.begin(9600);
    Serial.println("Booting");
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("Connection Failed! Rebooting...");
        delay(500);
        ESP.restart();
    }

    Serial.println("Ready");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    webSocket.on("status", statusEvent);
    webSocket.begin(host, port, socket_path);
}

int timeSinceLastReadSensors = 0;

void loop() {
    webSocket.loop();

    if (timeSinceLastReadSensors >= 20) { // 10 milli second
        readSensors();
        timeSinceLastReadSensors = 0;
    }
    
    delay(10); // 0.01 segundos
    timeSinceLastReadSensors += 1;
}
