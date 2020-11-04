import { Alert } from "react-native";

const addErrorTreatment = <T>(funct: () => T, defaultValue: T) => {
    try {
        return funct();
    } catch (e) {
        Alert.alert(
            "Erro de cálculo",
            __DEV__ ? e : "Calculadora tentou resolver uma expressão muito complicada."
        );
        return defaultValue;
    }
}

export default addErrorTreatment;