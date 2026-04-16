export function HeroAscii() {
  const art = [
    "  ~  ~                ^      ^                  ~   ~  ~  ",
    "    ~~  ~          ^ / \\  / \\  ^            ~  ~~        ",
    "                  / \\/    \\/   \\/                        ",
    "                                                           ",
    "                           *                              ",
    "            .  .  .  .  . /|\\ .  .  .  .  .              ",
    "          .  .  .  .  . ./   \\. .  .  .  .  .            ",
    "         .  .  .  .  .  |     | .  .  .  .  .  .          ",
    "        .  .  .  .  .  .|. . .|.  .  .  .  .  .           ",
    "       .  .  .  .  .  . | | | | .  .  .  .  .  .          ",
    "      .  .  .  .  .  .  |_|_|_|  .  .  .  .  .  .         ",
    "     .  .  .  .  .  .   |     |   .  .  .  .  .  .         ",
    "    .  .  .  .  .  .  . | | | | .  .  .  .  .  .  .        ",
    "   .  .  .  .  .  .  .  |_|_|_|  .  .  .  .  .  .  .       ",
    "  .  .  .  .  .  .  .   |     |   .  .  .  .  .  .  .       ",
    " .  .  .  .  .  .  .  . |_____|  .  .  .  .  .  .  .  .     ",
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . .    ",
  ].join("\n");

  return (
    <pre
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{
        fontFamily: "monospace",
        fontSize: "11px",
        lineHeight: "1.55",
        letterSpacing: "0.04em",
        color: "rgba(55,48,163,0.18)",
        whiteSpace: "pre",
        zIndex: 0,
      }}
    >
      {art}
    </pre>
  );
}
