import { createContext } from "react";
import WidgetRegistry from "./WidgetRegistry";

export const WidgetContext = createContext<WidgetRegistry | null>(null);