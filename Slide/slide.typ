#import "../others/lib.typ": *
#import themes.metropolis: *

#show: metropolis-theme.with(
  aspect-ratio: "4-3",
  header: none,
  header-right: none,
  footer: self => self.info.institution,
  footer-right: none,
  config-info(
    title: [数理科学研究会紹介動画],
    institution: [数理科学研究会],
  ),
  config-page(
    header-ascent: 0%,
    margin: (top: 1.8em, bottom: 1.5em, x: 2em),
  ),
  config-colors(
    primary: rgb("#3776ab"),
    secondary: rgb("#ffffff"),
    neutral-lightest: rgb("#ffffff"),
  ),
)

#set page(fill: rgb("#ffffff"))
#set text(
  fill: rgb("#243447"),
  size: 24pt,
  font: ("Comfortaa", "IPAMincho", "Noto Sans CJK JP"),
)
#show: set text(font: ("Comfortaa", "IPAMincho", "Noto Sans CJK JP"))

#let cute-card(body, width: 100%) = block(
  width: width,
  inset: (x: 1em, y: 0.8em),
  radius: 16pt,
  fill: rgb("#fffef8"),
  stroke: rgb("#ffe08a"),
  body,
)

#let cute-badge(body) = block(
  inset: (x: 0.6em, y: 0.2em),
  radius: 999pt,
  fill: rgb("#fff3bf"),
  stroke: rgb("#ffd343"),
  body,
)

#title-slide(
  extra: [
    #v(0.12em)
    #align(center)[
      #cute-card(width: 97%)[
        #image("logo.png", width: 96%)
      ]
    ]
  ],
)

#slide[
  #set text(font: "IPAPMincho")
  #block(
    breakable: false,
    width: 100%,
    [
      #align(center)[
        #cute-badge([
          #text(size: 1.25em, weight: "bold", fill: rgb("#3776ab"))[問題]
        ])
        #v(0.18em)
        #cute-card(width: 93%)[
          #text(size: 1.12em, fill: rgb("#243447"))[色が付いている角の大きさの和を求めよ]
          #v(0.24em)
          #image("star7.png", width: 66%)
        ]
      ]
    ],
  )
]

#slide[
  #set text(font: "IPAPMincho")
  #align(center)[
    #cute-card(width: 95%)[
      #v(0.25em)
      #text(size: 1.62em, weight: "bold", fill: rgb("#3776ab"))[数理科学研究会 部員募集中]
      #v(0.45em)
      #block(
        inset: (x: 0.6em, y: 0.2em),
        radius: 10pt,
        fill: rgb("#fff9df"),
        stroke: rgb("#ffe08a"),
        [#text(size: 1.2em, fill: rgb("#243447"))[毎週月曜日 5号館で活動中]],
      )
      #v(0.35em)
      #block(
        inset: (x: 0.6em, y: 0.2em),
        radius: 10pt,
        fill: rgb("#f3f9ff"),
        stroke: rgb("#b8d6ef"),
        [#text(size: 1.1em, fill: rgb("#2b5b84"))[
          数学・競技プログラミングが好きな人、大歓迎
        ]],
      )
      #v(0.7em)
      #line(length: 80%, stroke: .06em + rgb("#ffe08a"))
      #v(0.7em)
      #text(size: 1.44em, weight: "bold", fill: rgb("#3776ab"))[新入生歓迎会 4/6・4/7 (2号館)]
      #v(0.3em)
      #text(size: 1.26em, weight: "semibold", fill: rgb("#ffb300"))[懸賞問題出します]
    ]
  ]
]
