# Adfundum Meter - KLJ Merkem 🍺

A modern, interactive web application for timing ad fundum (bottoms up) drinking contests. Built for KLJ Merkem with a sleek dark theme, webcam recording, and comprehensive scoreboard functionality.

## 🎯 Features

- **Real-time timer**: Precise timing using hardware sensor integration
- **Webcam recording**: Capture and download your drinking attempts
- **Scoreboard**: Local storage of all attempts with ranking
- **Belgian humor**: Authentic Flemish congratulations messages
- **Responsive design**: Works on desktop and mobile devices
- **Dark theme**: Modern, eye-friendly interface
- **Hardware integration**: Works with physical sensor setup

## 🔧 Hardware Setup

This application uses the same hardware concept as [Floris Devreese's Ad-fundum-timer](https://github.com/FlorisDevreese/Ad-fundum-timer). **Credit to Floris Devreese** for the original hardware design concept - this is an improved version built from scratch but using his proven hardware approach.

### Required Components

1. **Proximity/Weight Sensor**

   - Infrared proximity sensor (e.g., Sharp GP2Y0A21YK)
   - OR pressure sensor/load cell
   - OR simple push button/microswitch

2. **Microcontroller** (Optional - for advanced setup)

   - Arduino Nano/Uno
   - OR direct wiring to keyboard

3. **USB Numpad/Keyboard**

   - Cheap USB numpad that can be modified
   - Must be able to access internal circuitry

4. **Wiring Materials**
   - Jumper wires
   - Soldering kit
   - Heat shrink tubing

### Assembly Instructions

#### Method 1: Direct Keyboard Modification (Recommended)

1. **Prepare the Numpad**

   - Open your USB numpad carefully
   - Locate the circuit board and identify the "8" key connections
   - Note: We use "8" because it's easily accessible and doesn't interfere with normal typing

2. **Sensor Placement**

   - Mount your sensor in a stable base/platform where the drink will be placed
   - Ensure the sensor can reliably detect when a drink is present vs. absent
   - Test the sensor's detection range and adjust mounting height accordingly

3. **Wiring the Sensor**

   - Connect sensor output to the "8" key circuit
   - When drink is ON sensor → "8" key is pressed
   - When drink is OFF sensor → "8" key is released
   - Add a pull-up resistor (10kΩ) if needed for stable readings

4. **Testing**
   - Plug in the modified numpad
   - Place a drink on sensor - you should see "8" being typed
   - Remove drink - typing should stop
   - Adjust sensor sensitivity if needed

#### Method 2: Arduino-Based Setup (Advanced)

1. **Arduino Programming**

   ```arduino
   // Simple Arduino sketch for sensor to keyboard
   #include <Keyboard.h>

   int sensorPin = A0;
   int threshold = 500; // Adjust based on your sensor
   bool drinkPresent = false;

   void setup() {
     Keyboard.begin();
     pinMode(sensorPin, INPUT);
   }

   void loop() {
     int sensorValue = analogRead(sensorPin);
     bool currentState = (sensorValue > threshold);

     if (currentState != drinkPresent) {
       if (currentState) {
         Keyboard.press('8');
       } else {
         Keyboard.release('8');
       }
       drinkPresent = currentState;
       delay(50); // Debounce
     }
   }
   ```

2. **Connections**
   - Connect sensor to Arduino analog pin A0
   - Power sensor with 3.3V or 5V from Arduino
   - Program Arduino as HID keyboard device

### Sensor Types and Setup

#### Option A: Infrared Proximity Sensor

- **Best for**: Clean, non-contact detection
- **Mounting**: Point upward from base, detect glass bottom
- **Range**: Adjust for reliable detection at 2-5cm

#### Option B: Pressure/Weight Sensor

- **Best for**: Most reliable detection
- **Mounting**: Under a platform where drink sits
- **Calibration**: Set threshold for empty vs. full glass weight

#### Option C: Microswitch

- **Best for**: Simple, cheap solution
- **Mounting**: Under a lever or platform that depresses when drink is placed
- **Reliability**: Very reliable but requires physical contact

### Housing and Mounting

1. **Base Platform**

   - Create a stable base for drink placement
   - Mark clear area where drink should be placed
   - Consider adding LED indicators for sensor status

2. **Protective Housing**
   - Protect electronics from spills
   - Ensure easy access for maintenance
   - Consider portable design for events

## 💻 Software Setup

### Quick Start

1. **Download the Application**

   ```bash
   git clone https://github.com/MateoGheeraert/adfundumtimer.git
   cd adfundumtimer
   ```

2. **Open in Browser**

   - Open `index.html` in your web browser
   - **Recommended browsers**: Chrome, Firefox, Edge
   - Allow webcam access when prompted

3. **Hardware Connection**
   - Connect your modified numpad/sensor setup
   - Test sensor by placing/removing drink - should see "8" characters if working

### Usage Instructions

1. **Setup**

   - Enter player name
   - Enable webcam (optional but recommended)
   - Click "Start Adfundum!"

2. **Gaming**

   - Place drink ON sensor (timer shows "waiting")
   - Remove drink to START timer and begin drinking
   - Place drink back ON sensor to STOP timer
   - View results and recording

3. **Features**
   - All scores saved locally in browser
   - Webcam recordings auto-download
   - Flemish congratulations messages
   - Scoreboard with rankings

## 🎮 How It Works

1. **"8" key pressed** (drink on sensor) = Drink detected, timer ready/stopped
2. **"8" key released** (drink removed) = Start drinking, timer running
3. **"8" key pressed again** = Finish drinking, timer stops, save score

The application monitors keyboard input for the "8" key to track drink placement and removal.

## 🏆 Scoring System

- **Times are measured in seconds** with 0.01s precision
- **Ranking**: Fastest times ranked first
- **Categories**:
  - 🏆 **First Place**: Best time overall
  - 👍 **Good Time**: Under 3 seconds
  - 🤔 **Needs Practice**: Over 3 seconds
- **Congratulations**: Random Flemish messages based on performance

## 🎥 Recording Features

- **Auto-recording**: Starts when timer begins
- **Auto-download**: Recording saved with player name and time
- **Format**: WebM video format
- **Storage**: Local downloads folder

## 🛠️ Troubleshooting

### Common Issues

**Timer not starting:**

- Check if "8" key is being detected
- Ensure sensor is properly connected
- Test numpad in text editor first

**Webcam not working:**

- Allow browser permissions
- Try different browser
- Check webcam is not used by other apps

**Sensor too sensitive/not sensitive enough:**

- Adjust sensor threshold/distance
- Check wiring connections
- Consider different sensor type

### Technical Support

- Check browser console (F12) for error messages
- Test hardware with simple text editor first
- Verify all connections are secure

## 🎨 Customization

The application can be customized by editing:

- `style.css`: Colors, layout, themes
- `script.js`: Messages, timing logic, features
- `index.html`: Structure and content

## 📱 Browser Compatibility

- ✅ **Chrome**: Full support
- ✅ **Firefox**: Full support
- ✅ **Edge**: Full support
- ⚠️ **Safari**: Limited webcam support
- ⚠️ **Mobile browsers**: Limited keyboard input support

## 🍺 Safety & Responsibility

- **Drink responsibly**: Never drink and drive
- **Know your limits**: This is for fun, not competition
- **Age restriction**: Only for legal drinking age
- **Health first**: Stop if you feel unwell

## 🙏 Credits

- **Original hardware concept**: [Floris Devreese](https://github.com/FlorisDevreese/Ad-fundum-timer) - Thank you for the inspiration and hardware design!
- **Development**: MateoGheeraert - Complete rewrite with modern features
- **Organization**: KLJ Merkem

## 📄 License

This project is open source. Use responsibly and give credit where due.

---

**Made with ❤️ for KLJ Merkem**

_Ad fundum!_ 🍻
