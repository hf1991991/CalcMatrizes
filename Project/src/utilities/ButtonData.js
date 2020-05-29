export default class ButtonData {
    constructor({source, style, onPress, disabled=false}) {
        this.source = source;
        this.style = style;
        this.onPress = onPress;
        this.disabled = disabled;
    }
}