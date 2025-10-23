# Lorenz Attractor Screensaver

A beautiful macOS screensaver that visualizes the famous Lorenz attractor, a set of chaotic solutions to the Lorenz system of differential equations.

![Lorenz Attractor](https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/A_Trajectory_Through_Phase_Space_in_a_Lorenz_Attractor.gif/400px-A_Trajectory_Through_Phase_Space_in_a_Lorenz_Attractor.gif)

## What is the Lorenz Attractor?

The Lorenz attractor is a set of chaotic solutions discovered by Edward Lorenz in 1963 while studying atmospheric convection. The system is defined by three coupled, nonlinear differential equations:

```
dx/dt = σ(y - x)
dy/dt = x(ρ - z) - y
dz/dt = xy - βz
```

Where σ, ρ, and β are system parameters. The classic values used in this screensaver are:
- σ (sigma) = 10
- ρ (rho) = 28
- β (beta) = 8/3

Despite the deterministic nature of these equations, the system exhibits chaotic behavior and sensitivity to initial conditions - the hallmark of chaos theory.

## Features

- Real-time integration of the Lorenz system using 4th-order Runge-Kutta method
- Smooth, colorful visualization with gradient trails
- Optimized 60 FPS animation
- 3D to 2D projection with rotation
- Native macOS screensaver implementation

## Requirements

- macOS 10.13 (High Sierra) or later
- Xcode Command Line Tools

## Installation

### Option 1: Build from source

1. Clone this repository:
```bash
git clone <repository-url>
cd lorenz
```

2. Build the screensaver:
```bash
make
```

3. Install the screensaver:
```bash
make install
```

4. Open **System Preferences > Desktop & Screen Saver > Screen Saver** and select "Lorenz Attractor"

### Option 2: Manual installation

1. Build the screensaver bundle:
```bash
make
```

2. Double-click the `LorenzAttractor.saver` bundle to install it, or manually copy it to:
   - `~/Library/Screen Savers/` (for current user only)
   - `/Library/Screen Savers/` (for all users, requires admin privileges)

## Building

The screensaver is built using Swift and native macOS frameworks. To compile manually:

```bash
swiftc -framework ScreenSaver -framework AppKit -framework Foundation \
       -target x86_64-apple-macosx10.13 \
       -sdk $(xcrun --show-sdk-path) \
       -module-name LorenzAttractor \
       -emit-executable LorenzAttractorView.swift \
       -o LorenzAttractor.saver/Contents/MacOS/LorenzAttractor
```

## Uninstallation

To remove the screensaver:

```bash
make uninstall
```

Or manually delete it from `~/Library/Screen Savers/LorenzAttractor.saver`

## Development

The screensaver is implemented in a single Swift file (`LorenzAttractorView.swift`) that:

1. **Numerical Integration**: Uses the Runge-Kutta 4th order method (RK4) for accurate integration of the differential equations
2. **Visualization**: Maintains a trajectory of recent points and draws them with color gradients
3. **3D Projection**: Projects the 3D attractor onto a 2D screen with a slight rotation for better visibility
4. **Performance**: Integrates multiple steps per frame and uses efficient drawing techniques

### Customization

You can modify the following parameters in `LorenzAttractorView.swift`:

- `sigma`, `rho`, `beta`: Lorenz system parameters
- `dt`: Integration time step
- `maxPoints`: Number of trajectory points to display
- `scale`: Zoom level for the visualization
- Color scheme in the `draw(_:)` method

## Technical Details

### The Mathematics

The Lorenz system represents a simplified model of atmospheric convection. The three variables represent:
- **x**: Rate of convective overturning
- **y**: Horizontal temperature variation
- **z**: Vertical temperature variation

The system is integrated forward in time, creating a trajectory through 3D phase space that traces out the characteristic butterfly-shaped attractor.

### Implementation Notes

- **RK4 Integration**: More accurate than Euler's method, maintaining stability over long integration periods
- **Frame Rate**: 60 FPS with 10 integration steps per frame balances smoothness and accuracy
- **Memory Management**: Circular buffer of points prevents unbounded memory growth
- **Thread Safety**: All state updates occur on the main thread

## License

MIT License - feel free to use and modify as you wish.

## Credits

Inspired by Edward Lorenz's groundbreaking work in chaos theory and the beautiful mathematical structures that emerge from simple nonlinear systems.

## Troubleshooting

**Screensaver doesn't appear in System Preferences:**
- Make sure the bundle is properly installed in `~/Library/Screen Savers/`
- Check that the Info.plist is valid
- Try restarting System Preferences

**Build errors:**
- Ensure Xcode Command Line Tools are installed: `xcode-select --install`
- Check that you're running macOS 10.13 or later
- Verify Swift compiler is available: `swiftc --version`

**Performance issues:**
- The screensaver is optimized for modern Macs
- You can reduce `maxPoints` in the source code for better performance on older hardware

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## See Also

- [Lorenz System (Wikipedia)](https://en.wikipedia.org/wiki/Lorenz_system)
- [Chaos Theory](https://en.wikipedia.org/wiki/Chaos_theory)
- [ScreenSaver Framework Documentation](https://developer.apple.com/documentation/screensaver)
