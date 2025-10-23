import ScreenSaver
import AppKit

class LorenzAttractorView: ScreenSaverView {
    // Lorenz system parameters
    private let sigma: Double = 10.0
    private let rho: Double = 28.0
    private let beta: Double = 8.0 / 3.0

    // Integration parameters
    private let dt: Double = 0.002

    // Current state
    private var x: Double = 0.1
    private var y: Double = 0.0
    private var z: Double = 0.0

    // Trajectory points
    private var points: [NSPoint] = []
    private let maxPoints = 5000

    // Animation timer
    private var lastUpdate: TimeInterval = 0

    // Color parameters
    private var hue: CGFloat = 0.0

    // Scale and offset for drawing
    private var scale: CGFloat = 8.0
    private var offsetX: CGFloat = 0
    private var offsetY: CGFloat = 0

    // MARK: - Initialization

    override init?(frame: NSRect, isPreview: Bool) {
        super.init(frame: frame, isPreview: isPreview)
        configure()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configure()
    }

    private func configure() {
        animationTimeInterval = 1.0 / 60.0

        // Calculate center offset
        offsetX = bounds.width / 2
        offsetY = bounds.height / 2

        // Adjust scale based on window size
        scale = min(bounds.width, bounds.height) / 80.0
    }

    // MARK: - Animation

    override func draw(_ rect: NSRect) {
        // Black background
        NSColor.black.setFill()
        rect.fill()

        // Draw the attractor trajectory
        if points.count > 1 {
            let path = NSBezierPath()

            for (index, point) in points.enumerated() {
                if index == 0 {
                    path.move(to: point)
                } else {
                    path.line(to: point)
                }

                // Draw with gradient color
                let colorProgress = CGFloat(index) / CGFloat(maxPoints)
                let color = NSColor(hue: hue + colorProgress * 0.3,
                                  saturation: 0.8,
                                  brightness: 0.9,
                                  alpha: 0.6 + 0.4 * colorProgress)
                color.setStroke()

                if index > 0 {
                    let segment = NSBezierPath()
                    segment.move(to: points[index - 1])
                    segment.line(to: point)
                    segment.lineWidth = 1.5
                    segment.stroke()
                }
            }
        }
    }

    override func animateOneFrame() {
        super.animateOneFrame()

        // Integrate the Lorenz system using Runge-Kutta 4th order
        for _ in 0..<10 {
            updateLorenzSystem()
        }

        // Convert 3D coordinates to 2D screen coordinates
        let screenPoint = projectTo2D(x: x, y: y, z: z)
        points.append(screenPoint)

        // Limit the number of points
        if points.count > maxPoints {
            points.removeFirst(points.count - maxPoints)
        }

        // Slowly rotate the hue for color variation
        hue += 0.0005
        if hue > 1.0 {
            hue -= 1.0
        }

        setNeedsDisplay(bounds)
    }

    // MARK: - Lorenz System

    private func updateLorenzSystem() {
        // Runge-Kutta 4th order integration
        let k1x = sigma * (y - x)
        let k1y = x * (rho - z) - y
        let k1z = x * y - beta * z

        let x2 = x + 0.5 * dt * k1x
        let y2 = y + 0.5 * dt * k1y
        let z2 = z + 0.5 * dt * k1z

        let k2x = sigma * (y2 - x2)
        let k2y = x2 * (rho - z2) - y2
        let k2z = x2 * y2 - beta * z2

        let x3 = x + 0.5 * dt * k2x
        let y3 = y + 0.5 * dt * k2y
        let z3 = z + 0.5 * dt * k2z

        let k3x = sigma * (y3 - x3)
        let k3y = x3 * (rho - z3) - y3
        let k3z = x3 * y3 - beta * z3

        let x4 = x + dt * k3x
        let y4 = y + dt * k3y
        let z4 = z + dt * k3z

        let k4x = sigma * (y4 - x4)
        let k4y = x4 * (rho - z4) - y4
        let k4z = x4 * y4 - beta * z4

        x += dt * (k1x + 2 * k2x + 2 * k3x + k4x) / 6.0
        y += dt * (k1y + 2 * k2y + 2 * k3y + k4y) / 6.0
        z += dt * (k1z + 2 * k2z + 2 * k3z + k4z) / 6.0
    }

    // MARK: - 3D Projection

    private func projectTo2D(x: Double, y: Double, z: Double) -> NSPoint {
        // Simple orthographic projection
        // Rotate slightly for a better view
        let angle: Double = 0.3

        let rotatedX = x * cos(angle) - z * sin(angle)
        let rotatedZ = x * sin(angle) + z * cos(angle)

        // Project to screen space
        let screenX = offsetX + CGFloat(rotatedX) * scale
        let screenY = offsetY + CGFloat(y) * scale

        return NSPoint(x: screenX, y: screenY)
    }

    // MARK: - Configuration Sheet

    override var hasConfigureSheet: Bool {
        return false
    }
}
