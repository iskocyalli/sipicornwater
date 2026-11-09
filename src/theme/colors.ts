// "Cotton Candy Dream" palette — see PROJECT.md §2.2
export const colors = {
  cottonPink: '#FFB8DE',
  lavender: '#C9B8FF',
  mint: '#A6F0D6',
  skyBlue: '#9FD8FF',
  butter: '#FFE8A3',
  peach: '#FFC7A8',
  cream: '#FFF8FC',
  plum: '#3D2357',
  plumSoft: '#7A6491',
} as const;

export const rainbow = [
  colors.skyBlue,
  colors.mint,
  colors.butter,
  colors.peach,
  colors.cottonPink,
  colors.lavender,
] as const;
