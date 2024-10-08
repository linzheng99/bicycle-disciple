import { atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useLayoutEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

import { nextFrame } from "~/lib/dom";
import { jotaiStore } from "~/lib/jotai";
import { getLocalStorage, setLocalStorage } from "~/lib/local";

type ColorMode = 'light' | 'dark' | 'system';
const useDarkQuery = () => useMediaQuery("(prefers-color-scheme: dark)")
const LOCALTHEME = 'color-mode'
const themeAtom = getLocalStorage(LOCALTHEME) ? atomWithStorage(LOCALTHEME, getLocalStorage(LOCALTHEME) || 'system') : atom('system')

export const useSetTheme = () =>
  useCallback((colorMode: ColorMode) => {
    jotaiStore.set(themeAtom, colorMode);
  }, []);

export const useThemeAtomValue = () => useAtomValue(themeAtom);

export const useSyncThemeWebApp = () => {
  const colorMode = useAtomValue(themeAtom) as ColorMode
  const systemIsDark = useDarkQuery()
  useLayoutEffect(() => {
    const realColorMode: Exclude<ColorMode, "system"> =
      colorMode === "system" ? (systemIsDark ? "dark" : "light") : colorMode
    document.documentElement.dataset.theme = realColorMode
    disableTransition(["[role=switch]>*"])()
    setLocalStorage(LOCALTHEME, colorMode)
  }, [colorMode, systemIsDark])
}

function disableTransition(disableTransitionExclude: string[] = []) {
  const css = document.createElement("style")
  css.append(
    document.createTextNode(
      `
*${disableTransitionExclude.map((s) => `:not(${s})`).join("")} {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  -ms-transition: none !important;
  transition: none !important;
}
      `,
    ),
  )
  document.head.append(css)

  return () => {
    // Force restyle
    ; (() => window.getComputedStyle(document.body))()

    // Wait for next tick before removing
    nextFrame(() => {
      css.remove()
    })
  }
}
