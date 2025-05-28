function schreibeMesswertAufDisplay (wert: number, position: number) {
    smartfeldAktoren.oledWriteNum(position)
    smartfeldAktoren.oledWriteStr(": ")
    stringMessung = convertToText(wert)
    smartfeldAktoren.oledWriteStr(stringMessung)
    for (let index = 0; index < 6 - stringMessung.length; index++) {
        smartfeldAktoren.oledWriteStr(" ")
    }
    listPos += 1
    if (position % 2 == 0) {
        smartfeldAktoren.oledNewLine()
    }
}
function messeMax () {
    ANZAHL_MESSUNGEN = 10
    maximum = 0
    for (let index = 0; index < ANZAHL_MESSUNGEN; index++) {
        maximum = Math.max(maximum, smartfeldSensoren.getHalfWord_Visible())
    }
    return Math.round(maximum)
}
function messeHelligkeitsUnterschied (ledNr: number) {
    led_strip.setPixelColor(ledNr, neopixel.colors(NeoPixelColors.Black))
    led_strip.show()
    h_umgebung = messeMax()
    led_strip.setPixelColor(ledNr, neopixel.colors(NeoPixelColors.White))
    led_strip.show()
    h_mitLED = messeMax()
    h_unterschied = h_mitLED - h_umgebung
    led_strip.setPixelColor(ledNr, neopixel.colors(NeoPixelColors.Black))
    led_strip.show()
    return h_unterschied
}
function messen () {
    m_list = []
    LedPos = ERSTE_LED_POS
    for (let index = 0; index < ANZAHL_LEDS; index++) {
        m_list.push(messeHelligkeitsUnterschied(LedPos))
        LedPos += 1
    }
    return m_list
}
let wertLeerMinusMessung = 0
let personen = 0
let LedPos = 0
let m_list: number[] = []
let h_unterschied = 0
let h_mitLED = 0
let h_umgebung = 0
let maximum = 0
let ANZAHL_MESSUNGEN = 0
let listPos = 0
let stringMessung = ""
let led_strip: neopixel.Strip = null
let ERSTE_LED_POS = 0
let ANZAHL_LEDS = 0
smartfeldSensoren.initSunlight()
ANZAHL_LEDS = 9
ERSTE_LED_POS = 2
smartfeldAktoren.oledInit(128, 64)
led_strip = neopixel.create(DigitalPin.P1, 16, NeoPixelMode.RGB_RGB)
led_strip.setBrightness(255)
let list_leermessungen: number[] = []
let list_messungen: number[] = []
list_leermessungen = messen()
for (let index = 0; index < ANZAHL_LEDS; index++) {
    list_leermessungen.push(0)
    list_messungen.push(0)
}
basic.forever(function () {
    personen = 0
    if (input.buttonIsPressed(Button.A)) {
        list_leermessungen = messen()
    } else {
        list_messungen = messen()
        smartfeldAktoren.oledClear()
        listPos = 0
        for (let index = 0; index < ANZAHL_LEDS; index++) {
            wertLeerMinusMessung = list_leermessungen[listPos] - list_messungen[listPos]
            if (wertLeerMinusMessung > 70) {
                personen += 1
            }
            schreibeMesswertAufDisplay(wertLeerMinusMessung, listPos)
        }
        basic.showNumber(personen)
    }
})
