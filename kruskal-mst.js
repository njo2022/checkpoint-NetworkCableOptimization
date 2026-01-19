const readline = require('readline');

// ============================================================================
// CLASSE UNION-FIND : Gestion efficace des composantes connexes
// ============================================================================
class UnionFind {
  // Initialise la structure avec n éléments, chacun est sa propre composante
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rang = Array(n).fill(0);
  }

  // Trouve la racine de l'élément x avec compression de chemin
  trouver(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.trouver(this.parent[x]);
    }
    return this.parent[x];
  }

  // Unifie deux composantes si elles sont différentes
  // Retourne true si l'union a eu lieu, false si elles étaient déjà unies (cycle détecté)
  unifier(x, y) {
    const racineX = this.trouver(x);
    const racineY = this.trouver(y);

    // Si les deux éléments ont la même racine, ils sont déjà dans la même composante
    if (racineX === racineY) {
      return false; // Cycle détecté
    }

    // Union par rang : attache le plus petit arbre à la racine du plus grand
    if (this.rang[racineX] < this.rang[racineY]) {
      this.parent[racineX] = racineY;
    } else if (this.rang[racineX] > this.rang[racineY]) {
      this.parent[racineY] = racineX;
    } else {
      this.parent[racineY] = racineX;
      this.rang[racineX]++;
    }

    return true; // Union réussie, pas de cycle
  }
}

// ============================================================================
// FONCTION PRINCIPALE : Algorithme de Kruskal pour l'Arbre Couvrant Minimum
// ============================================================================
function calculerMST(nbNoeuds, listeAretes) {
  // Validation des entrées
  if (nbNoeuds <= 0) {
    return { aretesMST: [], coutTotal: 0, erreur: 'Le nombre de nœuds doit être positif' };
  }

  if (listeAretes.length === 0) {
    return { aretesMST: [], coutTotal: 0, erreur: 'Aucune arête fournie' };
  }

  // Étape 1 : Trier les arêtes par coût croissant
  const areteTriees = [...listeAretes].sort((a, b) => a.cout - b.cout);

  // Étape 2 : Initialiser l'Union-Find
  const uf = new UnionFind(nbNoeuds);

  // Étape 3 : Construire l'MST en parcourant les arêtes triées
  const aretesMST = [];
  let coutTotal = 0;

  for (const arete of areteTriees) {
    const { de, vers, cout } = arete;

    // Vérifier que les nœuds sont valides
    if (de < 0 || de >= nbNoeuds || vers < 0 || vers >= nbNoeuds) {
      console.error(`Arete invalide : (${de}, ${vers})`);
      continue;
    }

    // Si l'arête ne crée pas de cycle, l'ajouter à l'MST
    if (uf.unifier(de, vers)) {
      aretesMST.push(arete);
      coutTotal += cout;

      // Arrêter quand on a n-1 arêtes (MST complet)
      if (aretesMST.length === nbNoeuds - 1) {
        break;
      }
    }
  }

  // Vérifier si l'MST est complet
  if (aretesMST.length !== nbNoeuds - 1) {
    return {
      aretesMST,
      coutTotal,
      erreur: `Graphe non connexe : seulement ${aretesMST.length} arêtes au lieu de ${nbNoeuds - 1}`
    };
  }

  return { aretesMST, coutTotal };
}

// ============================================================================
// INTERFACE UTILISATEUR : Saisie interactive avec readline
// ============================================================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction utilitaire pour poser une question à l'utilisateur
function poserQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (reponse) => {
      resolve(reponse.trim());
    });
  });
}

// Fonction principale asynchrone
async function principal() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Optimisation du Câblage Réseau - Algorithme de Kruskal        ║');
  console.log('║  Calcul de l\'Arbre Couvrant Minimum pour un Réseau            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // Saisie du nombre d'ordinateurs
    const nbNoeudsStr = await poserQuestion('📊 Nombre d\'ordinateurs à connecter : ');
    const nbNoeuds = parseInt(nbNoeudsStr, 10);

    if (isNaN(nbNoeuds) || nbNoeuds <= 0) {
      console.error('❌ Erreur : Entrez un nombre positif');
      rl.close();
      return;
    }

    console.log(`\n💻 Vous avez ${nbNoeuds} ordinateur(s) à connecter.`);
    console.log('📝 Entrez les connexions possibles (format: "ordinateur1 ordinateur2 coût")');
    console.log('   Les ordinateurs sont numérotés de 0 à ' + (nbNoeuds - 1));
    console.log('   Tapez "FIN" pour terminer la saisie des connexions.\n');

    const listeAretes = [];
    let numArete = 1;

    while (true) {
      const saisie = await poserQuestion(`Connexion ${numArete} : `);

      if (saisie.toUpperCase() === 'FIN') {
        if (listeAretes.length === 0) {
          console.error('❌ Vous devez entrer au moins une connexion.');
          continue;
        }
        break;
      }

      // Parser la saisie
      const parties = saisie.split(/\s+/);
      if (parties.length !== 3) {
        console.error('⚠️  Format invalide. Utilisez : "de vers cout"');
        continue;
      }

      const de = parseInt(parties[0], 10);
      const vers = parseInt(parties[1], 10);
      const cout = parseInt(parties[2], 10);

      if (isNaN(de) || isNaN(vers) || isNaN(cout)) {
        console.error('⚠️  Les valeurs doivent être des nombres entiers.');
        continue;
      }

      if (de === vers) {
        console.error('⚠️  Une connexion ne peut pas relier un ordinateur à lui-même.');
        continue;
      }

      listeAretes.push({ de, vers, cout });
      numArete++;
    }

    // Affichage du graphe saisi
    console.log('\n📋 Connexions saisies :');
    listeAretes.forEach((arete, idx) => {
      console.log(`   ${idx + 1}. Ordi ${arete.de} ↔ Ordi ${arete.vers} : ${arete.cout} m de câble`);
    });

    // Calcul de l'MST
    console.log('\n⚙️  Calcul de l\'arbre couvrant minimum...\n');
    const resultat = calculerMST(nbNoeuds, listeAretes);

    if (resultat.erreur) {
      console.error(`❌ Erreur : ${resultat.erreur}`);
    } else {
      // Affichage des résultats
      console.log('✅ Arbre Couvrant Minimum trouvé !\n');
      console.log('🔗 Connexions optimales :');
      resultat.aretesMST.forEach((arete, idx) => {
        console.log(`   ${idx + 1}. Ordi ${arete.de} ↔ Ordi ${arete.vers} : ${arete.cout} m`);
      });

      console.log(`\n📏 Coût total du câblage : ${resultat.coutTotal} mètres`);
      console.log(`💾 Nombre de connexions : ${resultat.aretesMST.length}/${nbNoeuds - 1}`);
    }
  } catch (err) {
    console.error('❌ Erreur lors de l\'exécution :', err.message);
  } finally {
    console.log('\n👋 Au revoir !\n');
    rl.close();
  }
}

// Lancer le programme
principal();
