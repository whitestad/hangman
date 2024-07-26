const color = 'white'
const scale = 0.8;

const HEAD = (
    <div
        style={{
            width: `${50 * scale}px`,
            height: `${50 * scale}px`,
            borderRadius: "100%",
            border: `${10 * scale}px solid ${color}`,
            position: "absolute",
            top: `${50 * scale}px`,
            right: `${-30 * scale}px`
        }}
        key="head"
    />
)

const BODY = (
    <div
        style={{
            width: `${10 * scale}px`,
            height: `${100 * scale}px`,
            background: color,
            position: "absolute",
            top: `${120 * scale}px`,
            right: 0
        }}
        key="body"
    />
)

const RIGHT_ARM = (
    <div
        style={{
            width: `${100 * scale}px`,
            height: `${10 * scale}px`,
            background: color,
            position: "absolute",
            top: `${150 * scale}px`,
            right: `${-100 * scale}px`,
            rotate: "-30deg",
            transformOrigin: "left bottom"
        }}
        key="right_arm"
    />
)

const LEFT_ARM = (
    <div
        style={{
            width: `${100 * scale}px`,
            height: `${10 * scale}px`,
            background: color,
            position: "absolute",
            top: `${150 * scale}px`,
            right: `${10 * scale}px`,
            rotate: "30deg",
            transformOrigin: "right bottom"
        }}
        key="left_arm"
    />
)

const RIGHT_LEG = (
    <div
        style={{
            width: `${100 * scale}px`,
            height: `${10 * scale}px`,
            background: color,
            position: "absolute",
            top: `${210 * scale}px`,
            right: `${-90 * scale}px`,
            rotate: "60deg",
            transformOrigin: "left bottom"
        }}
        key="right_leg"
    />
)

const LEFT_LEG = (
    <div
        style={{
            width: `${100 * scale}px`,
            height: `${10 * scale}px`,
            background: color,
            position: "absolute",
            top: `${210 * scale}px`,
            right: 0,
            rotate: "-60deg",
            transformOrigin: "right bottom"
        }}
        key="left_leg"
    />
)

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG]

type HangmanDrawingProps = {
    numBadGuesses: number
}

export function HangmanDrawing({ numBadGuesses }: HangmanDrawingProps) {
    return (
        <div style={{ position: "relative", transform: `scale(${scale})` }}>
            {BODY_PARTS.slice(0, numBadGuesses)}
            <div style={{ height: `${50 * scale}px`, width: `${10 * scale}px`, background: color, position: "absolute", top: 0, right: 0 }} />
            <div style={{ height: `${10 * scale}px`, width: `${200 * scale}px`, background: color, marginLeft: `${120 * scale}px` }} />
            <div style={{ height: `${400 * scale}px`, width: `${10 * scale}px`, background: color, marginLeft: `${120 * scale}px` }} />
            <div style={{ height: `${10 * scale}px`, width: `${250 * scale}px`, background: color }} />
        </div>
    )
}
