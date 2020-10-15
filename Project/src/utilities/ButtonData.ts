import { ImageSourcePropType } from "react-native";

export default interface ButtonData {
    source: ImageSourcePropType;
    sourceActive?: ImageSourcePropType;
    onPress?: (params: any) => void;
    flex?: number;
    disabled?: boolean;
    active?: boolean;
}