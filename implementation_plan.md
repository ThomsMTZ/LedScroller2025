# Plan d'Implémentation - Correction des Réglages de Taille et Épaisseur

## Contexte
L'ajout des sliders pour l'épaisseur et la taille du texte a introduit 3 bugs :
1. Les boutons `+` et `-` ne fonctionnaient pas visuellement car ils ne mettaient à jour que la valeur animée `fontSize.value` (Reanimated) sans mettre à jour l'état React (`fontSizeState`), ni l'état sauvegardé de la gesture (`savedFontSize.value`).
2. Le zoom (pinch) s'est désynchronisé : comme le slider ne mettait pas à jour `savedFontSize.value`, toute nouvelle tentative de pinch repartait de l'ancienne taille, créant un saut désagréable.
3. Aucun garde-fou (limite) pour les tailles max : le slider permettait d'aller jusqu'à 600px de taille, même si le conteneur (`PORTRAIT_PANEL_HEIGHT`) ne fait que ~250px de haut. Cela provoque une coupure sévère des lettres.

## Changements Proposés

### 1. Synchronisation des États de Taille (useLedAnimation.tsx)
- Mettre à jour `setFontSize(size: number)` pour qu'il mette à jour **toutes** les sources de vérité : 
  - `fontSize.value = size` (Animation immédiate)
  - `savedFontSize.value = size` (Base pour la prochaine gesture Pinch)
  - `setFontSizeState(size)` (État React pour recalculer la `textWidth` et éviter que le texte ne soit coupé horizontalement).

### 2. Ajout du Garde-Fou "MaxFontSize" (Types & Composants)
- Exposer `maxFontSize` depuis `useLedAnimation` vers `LedScroller`.
- Passer `maxFontSize` dans les props de `SettingsModal` -> `TextAppearanceSection`.
- Restreindre la valeur du Slider et des boutons `+`/`-` avec `Math.min(valeur_voulue, maxFontSize)`. Ainsi, il sera impossible de dépasser la hauteur du conteneur.

### 3. Gestion des boutons + et - (TextAppearanceSection.tsx)
- Correction des appels des boutons pour bien prendre en compte la nouvelle limite dynamique.
- Ajout d'une fluidité en évitant d'appeler `onFontSizeChange` sur le Slider si la valeur ne bouge pas. On séparera `onValueChange` (pendant le drag du slider) et `onSlidingComplete` (au relâchement) si nécessaire, ou on laissera `onValueChange` si les performances sont bonnes.

## Revue Utilisateur Requise
- Est-ce que tu es d'accord pour que la taille maximale sur le Slider soit dynamique et bloquée automatiquement à la hauteur disponible de ton écran pour éviter de couper le texte ?
- Ce plan respecte le `/plan-before-action` et le `/global-improvement` en séparant bien la logique d'animation (Reanimated) et la logique React (State), et en gardant la responsabilité du calcul de layout (`maxFontSize`) centralisée.
