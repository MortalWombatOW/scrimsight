// export const insertUrlParam = (
//   key: string,
//   value: string | number | string[] | number[],
// ) => {
//   const valueStr = Array.isArray(value)
//     ? (value as string[] | number[]).join(',')
//     : value.toString();
//   if (window.history.pushState) {
//     const searchParams = new URLSearchParams(window.location.search);
//     searchParams.set(key, valueStr);
//     const newurl =
//       window.location.protocol +
//       '//' +
//       window.location.host +
//       window.location.pathname +
//       '?' +
//       searchParams.toString();
//     window.history.pushState({path: newurl}, '', newurl);
//   }
// };
