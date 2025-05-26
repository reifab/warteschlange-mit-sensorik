function messeHelligkeitsUnterschied (ledNr: number) {
    led_strip.setPixelColor(ledNr, neopixel.colors(NeoPixelColors.Black))
    led_strip.show()
    h_umgebung = messeMaximum()
    led_strip.setPixelColor(ledNr, neopixel.colors(NeoPixelColors.White))
    led_strip.show()
    h_mitLED = messeMaximum()
    h_unterschied = h_mitLED - h_umgebung
    led_strip.setPixelColor(ledNr, neopixel.colors(NeoPixelColors.Black))
    led_strip.show()
}
function messeMaximum () {
    max = 0
    for (let Index = 0; Index <= 10; Index++) {
        max = Math.max(max, smartfeldSensoren.getHalfWord_Visible())
    }
    return max
}
function messen () {
    m_list = [0]
    for (let LedNr = 0; LedNr <= 3; LedNr++) {
        messeHelligkeitsUnterschied(LedNr)
        m_list[LedNr] = h_unterschied
    }
    return m_list
}
let personen = 0
let m_list: number[] = []
let max = 0
let h_unterschied = 0
let h_mitLED = 0
let h_umgebung = 0
let led_strip: neopixel.Strip = null
smartfeldSensoren.initSunlight()
smartfeldAktoren.oledInit(128, 64)
led_strip = neopixel.create(DigitalPin.P1, 16, NeoPixelMode.RGB_RGB)
led_strip.setBrightness(255)
let list_leermessungen = [0]
let list_messungen = [0]
list_leermessungen = messen()
basic.forever(function () {
    personen = 0
    if (input.buttonIsPressed(Button.A)) {
        list_leermessungen = messen()
    } else {
        list_messungen = messen()
        smartfeldAktoren.oledClear()
        for (let LedNr = 0; LedNr <= 3; LedNr++) {
            let list_leermessungMinusMessung: number[] = []
            list_leermessungMinusMessung[LedNr] = list_leermessungen[LedNr] - list_messungen[LedNr]
            smartfeldAktoren.oledWriteNumNewLine(list_leermessungMinusMessung[LedNr])
            if (list_leermessungMinusMessung[LedNr] > 50) {
                personen += 1
            }
        }
        smartfeldAktoren.oledWriteStr("Personen: ")
        smartfeldAktoren.oledWriteNumNewLine(personen)
    }
})
