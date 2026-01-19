# 🌐 Optimisation du Câblage Réseau avec Kruskal

**Un script Node.js qui implémente l'algorithme de Kruskal pour calculer l'Arbre Couvrant Minimum (MST) d'un réseau informatique.**

---

## 📖 Vue d'ensemble

Ce projet résout le problème classique de l'optimisation du câblage réseau : **Comment connecter plusieurs ordinateurs avec le coût minimal de câblage ?**

L'algorithme de **Kruskal** garantit une solution optimale en construisant progressivement un arbre qui relie tous les nœuds (ordinateurs) sans cycle et avec le coût total minimum.

---

## 🏗️ Architecture du code

### 1. **Classe `UnionFind`**
Gère les composantes connexes du graphe pour détecter les cycles efficacement.

```javascript
class UnionFind {
  trouver(x)      // Trouve la racine de l'élément x
  unifier(x, y)   // Unifie deux composantes
}
```

**Méthodes principales :**
- **`trouver(x)`** : Retourne la racine de l'élément avec compression de chemin (optimisation O(α(n)))
- **`unifier(x, y)`** : Essaie d'unifier deux composantes avec union par rang
  - Retourne `true` → l'arête a été ajoutée (pas de cycle)
  - Retourne `false` → cycle détecté, arête ignorée

**Complexité :** O(α(n)) par opération, pratiquement O(1) en pratique.

### 2. **Fonction `calculerMST(nbNoeuds, listeAretes)`**
Implémente l'algorithme de Kruskal complet.

**Étapes :**
1. **Trier** les arêtes par coût croissant
2. **Parcourir** chaque arête dans l'ordre
3. **Unifier** si pas de cycle, sinon ignorer
4. **Arrêter** quand n-1 arêtes sont ajoutées

**Retour :**
```javascript
{
  aretesMST,  // Tableau des arêtes du MST
  coutTotal,  // Coût total du câblage
  erreur      // Message d'erreur si graphe non connexe
}
```

### 3. **Interface interactive avec `readline`**
Permet la saisie dynamique des données utilisateur.

**Flux utilisateur :**
- Entrée du nombre d'ordinateurs
- Saisie des connexions possibles (format : `de vers coût`)
- Affichage des résultats optimaux

---

## 🚀 Guide d'utilisation

### Installation
```bash
# Aucune dépendance externe requise (utilise les modules natifs Node.js)
node kruskal-mst.js
```

### Exemple d'exécution
```
📊 Nombre d'ordinateurs à connecter : 4

💻 Vous avez 4 ordinateur(s) à connecter.
📝 Entrez les connexions possibles (format: "ordinateur1 ordinateur2 coût")
   Les ordinateurs sont numérotés de 0 à 3
   Tapez "FIN" pour terminer la saisie des connexions.

Connexion 1 : 0 1 10
Connexion 2 : 1 2 15
Connexion 3 : 2 3 20
Connexion 4 : 0 3 30
Connexion 5 : FIN

📋 Connexions saisies :
   1. Ordi 0 ↔ Ordi 1 : 10 m de câble
   2. Ordi 1 ↔ Ordi 2 : 15 m de câble
   3. Ordi 2 ↔ Ordi 3 : 20 m de câble
   4. Ordi 0 ↔ Ordi 3 : 30 m de câble

✅ Arbre Couvrant Minimum trouvé !

🔗 Connexions optimales :
   1. Ordi 0 ↔ Ordi 1 : 10 m
   2. Ordi 1 ↔ Ordi 2 : 15 m
   3. Ordi 2 ↔ Ordi 3 : 20 m

📏 Coût total du câblage : 45 mètres
💾 Nombre de connexions : 3/3
```

---

## 📚 Comprendre Kruskal étape par étape

### Exemple : 4 ordinateurs, 5 connexions possibles

| Arête | De  | Vers | Coût | Action | Raison |
|-------|-----|------|------|--------|--------|
| (0,1) | 0   | 1    | 10   | ✅ Ajouter | Pas de cycle |
| (1,2) | 1   | 2    | 15   | ✅ Ajouter | Pas de cycle |
| (2,3) | 2   | 3    | 20   | ✅ Ajouter | Pas de cycle (MST complet : 3 arêtes) |
| (0,3) | 0   | 3    | 30   | ❌ Ignorer | Cycle détecté (0-1-2-3 déjà connectés) |
| (1,3) | 1   | 3    | 25   | - | Non évaluée (MST déjà complet) |

**Résultat :** MST = {(0,1), (1,2), (2,3)} avec coût total = 45

---

## 🔐 Gestion des erreurs

Le script valide :
- ✅ Nombre de nœuds positif
- ✅ Format des arêtes (deux nœuds et un coût)
- ✅ Nœuds dans la plage valide [0, nbNoeuds-1]
- ✅ Pas de boucles sur un nœud (de ≠ vers)
- ✅ Graphe connexe (sinon l'erreur est signalée)

---

## 📊 Complexité algorithmique

| Opération | Complexité |
|-----------|-----------|
| Trier les arêtes | **O(m log m)** où m = nombre d'arêtes |
| Union-Find avec compression + rang | **O(α(n))** ≈ **O(1)** pratiquement |
| Parcourir les arêtes | **O(m)** |
| **Total Kruskal** | **O(m log m)** |

Pour un graphe dense (m ≈ n²), c'est **O(n² log n)**.

---

## 💡 Cas d'usage réels

✅ **Réseaux informatiques** : Optimiser le câblage d'une infrastructure  
✅ **Électricité** : Distribution optimale d'énergie  
✅ **Télécommunications** : Routage minimal de lignes téléphoniques  
✅ **Routage réseau** : Construction d'arbres de diffusion optimaux  
✅ **Biologie** : Analyse de chaînes phylogénétiques  

---

## 🎯 Variations et extensions

### Extension 1 : Sauvegarder le résultat en JSON
```javascript
const fs = require('fs');
const resultat = calculerMST(nbNoeuds, listeAretes);
fs.writeFileSync('mst-resultat.json', JSON.stringify(resultat, null, 2));
```

### Extension 2 : Visualiser le MST (format Graphviz)
```javascript
const dot = `digraph G {
  ${resultat.aretesMST.map(a => `${a.de} -- ${a.vers} [label="${a.cout}"];`).join('\n  ')}
}`;
console.log(dot);
```

### Extension 3 : Algorithme de Prim (alternative)
L'algorithme de Prim est une alternative pour les graphes denses.

---

## 📋 Checklist d'implémentation

- ✅ Classe UnionFind avec compression de chemin et union par rang
- ✅ Fonction calculerMST avec tri et parcours optimal
- ✅ Interface readline pour saisie interactive
- ✅ Commentaires détaillés en français pédagogique
- ✅ Noms de variables courts et descriptifs
- ✅ Gestion d'erreurs complète
- ✅ Affichage formaté avec emojis (optionnel, peut être retiré)
- ✅ Complexité optimale O(m log m)

---

## 📝 Auteur

Créé comme exemple d'implémentation moderne d'algorithme classique avec Node.js.

---

## 📄 Licence

Libre d'utilisation et de modification.
