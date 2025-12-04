import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Radio, Button, Typography, ThemeProvider as LeuxThemeProvider } from "@leux/ui";
import { leuxGlobalConfig } from "@/leuxConfig";
import { darkTheme, lightTheme } from "@/styles";
import { AppThemeProvider } from "@/providers";
import { Provider as StoreProvider } from "react-redux";
import store from "@/store/store";
import { ParameterType } from "jspsych";


export const createLeuxRadioTrial = (jsPsych: any) => {

  class LeuxRadioTrialPlugin {
    static info = {
      name: "leux-radio-trial",
      version: "1.0.0",

      parameters: {
        audioSource: {
          type: ParameterType.STRING,
          default: null,
        },
        prompt: {
          type: ParameterType.STRING,
          default: "Please rate the quality.",
        },
        scale: {
          type: ParameterType.STRING,
          array: true,
          default: ["1", "2", "3", "4", "5"],
        },
      },

      data: {
        response: { type: ParameterType.STRING },
        rt: { type: ParameterType.INT },
      },
    };

    trial(display_element: HTMLElement, trial: any) {
      const root = ReactDOM.createRoot(display_element);
      const t0 = performance.now();

      const TrialComponent: React.FC = () => {
        const [selected, setSelected] = useState<string | null>(null);

        const handleSubmit = () => {
          const rt = Math.round(performance.now() - t0);

          root.unmount();
          display_element.innerHTML = "";

          jsPsych.finishTrial({
            response: selected,
            rt,
          });
        };
        const handleRadioChange = (e: any) => {
          // Leux might pass event or value; handle both safely
          const val =
            typeof e === "string"
              ? e
              : e?.target?.value ?? e?.value ?? null;

          setSelected(val);
        }

        return (
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
              <audio controls src={trial.audioSource} style={{ width: 300 }} />
            </div>

            <div style={{ marginTop: 16 }}>
              <Typography>{trial.prompt}</Typography>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {trial.scale.map((n: number) => {
                const v = String(n);
                return (
                  <Radio
                    key={v}
                    fieldKey="mos"                 // group key
                    value={v}                      // Leux expects string
                    defaultChecked={selected === v}
                    label={v}
                    onChange={handleRadioChange}
                    customStyles={{
                      marginRight: 12,
                      accentColor: lightTheme.primary,
                      color: lightTheme.primary,
                      fontSize: 16,
                    }}
                  />
                );
              })}
            </div>

            <div style={{ marginTop: 16 }}>
              <Button
                colorScheme="primary"
                onClick={handleSubmit}
                state={{ disabled: selected === null }}
              >
                Confirm
              </Button>
            </div>
          </div>
        );
      };

      root.render(
        <StoreProvider store={store}>
          <LeuxThemeProvider
            themes={{ light: lightTheme, dark: darkTheme }}
            globalConfig={leuxGlobalConfig}
          >
            <AppThemeProvider>
              <TrialComponent />
            </AppThemeProvider>
          </LeuxThemeProvider>
        </StoreProvider>
      );
    }
  }

  return LeuxRadioTrialPlugin;
};
