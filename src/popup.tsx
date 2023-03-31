import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style/popup.css";

const Popup = () => {
  const getSaveGas = async () => {
    const result: Record<string, any> = await new Promise((resolve) => {
      chrome.storage.local.get("notificationGas", (result) => {
        resolve(result);
      });
    });
    return result.notificationGas || "";
  };
  const [value, setValue] = useState("");

  useEffect(() => {
    (async () => {
      const gas = await getSaveGas();
      console.log("useEffect.getSaveGas", gas);
      if (gas) {
        setValue(gas);
      }
    })();
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target?.value);
  };
  const saveGas = () => {
    chrome.storage.local.set({ notificationGas: value }, () => {
      console.log("notificationGas is set to " + value);
    });
  };
  return (
    <div className="container">
      <span>Please input your notification gas value:</span>
      <input value={value} onChange={handleChange} />
      <button onClick={() => saveGas()}>save</button>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
