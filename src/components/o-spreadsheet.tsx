// 'use client';
// import { useEffect, useRef } from 'react';
// // import { Model } from '@odoo/o-spreadsheet/model';
// // import { CorePlugin } from '@odoo/o-spreadsheet/core_plugins/core_plugin';
// import * as oSpreadsheet from '@odoo/o-spreadsheet';
// const Model = oSpreadsheet.Model;
// const CorePlugin = oSpreadsheet.CorePlugin
// const SpreadsheetComponent = () => {
//   const spreadsheetRef = useRef(null);

// useEffect(() => {
//   if (typeof window === 'undefined' || !spreadsheetRef.current) return;

//   // Initialize model
//   const model = new Model(
//     {
//       sheets: [{
//         id: 'sheet1',
//         name: 'Sheet 1',
//         rows: 100,
//         cols: 26,
//       }]
//     },
//     // { plugins: [new CorePlugin()] }
//   );

//   // Dynamically import the mount function
//   import('@odoo/o-spreadsheet').then(({ mount }) => {
//     const unmount = mount(model, spreadsheetRef.current);

//     return () => {
//       if (unmount) unmount();
//     };
//   });
// }, []);

//   useEffect(() => {
//   if (!spreadsheetRef.current) return;

//   // Import the ENTIRE package as a namespace
//   import('@odoo/o-spreadsheet').then((oSpreadsheet) => {
//     // Access mount through the namespace
//     const { mount } = oSpreadsheet;

//     // Initialize model
//     const model = new oSpreadsheet.Model({
//       sheets: [/* ... */]
//     }, {
//       // plugins: [new oSpreadsheet.CorePlugin()]
//     });

//     // Mount the spreadsheet
//     const unmount = mount(model, spreadsheetRef.current!);

//     return () => unmount();
//   });
// }, []);

//   return <div ref={spreadsheetRef} style={{ height: '100vh', width: '100%' }} />;
// };

// export default SpreadsheetComponent;

"use client";
import { useEffect, useRef } from "react";

const SpreadsheetComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialize = async () => {
      // Ensure Owl is loaded first
      await import("@odoo/owl");

      // Then load o-spreadsheet
      const { Model, CorePlugin, mount } = await import("@odoo/o-spreadsheet");

      if (containerRef.current) {
        const model = new Model(
          {
            sheets: [
              {
                id: "sheet1",
                name: "Sheet 1",
                rows: 100,
                cols: 26,
              },
            ],
          },
          { plugins: [new CorePlugin()] }
        );

        const unmount = mount(model, containerRef.current);
        return () => unmount();
      }
    };

    initialize();
  }, []);


  useEffect(() => {
  const loadScripts = async () => {
    // Load Owl first
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = '/node_modules/@odoo/owl/dist/owl.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });

    // Then load spreadsheet
    const { Model, CorePlugin, mount } = await import('@odoo/o-spreadsheet');
    if (containerRef.current) {
        const model = new Model(
          {
            sheets: [
              {
                id: "sheet1",
                name: "Sheet 1",
                rows: 100,
                cols: 26,
              },
            ],
          },
          { plugins: [new CorePlugin()] }
        );

        const unmount = mount(model, containerRef.current);
        return () => unmount();
      }
  };

  loadScripts();
}, []);

  return <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />;
};

export default SpreadsheetComponent;
