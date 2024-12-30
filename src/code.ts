import getThemeJson from "./services/getThemeJson";

const exportFile = () => {
  try {
    const themeInJSON = getThemeJson();
    figma.ui.postMessage({ type: "EXPORT_MESSAGE", body: themeInJSON });
  } catch (error) {
    console.log("error", error);
  }
};

figma.ui.onmessage = (e: { type: string; body: string }) => {
  if (e.type === "EXPORT") {
    exportFile();
  }
};

figma.showUI(__uiFiles__["export"], {
  width: 800,
  height: 1000,
  themeColors: true,
});
