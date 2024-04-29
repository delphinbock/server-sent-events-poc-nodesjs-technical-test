
# Test développeur Core JS fullstack
## Objectif global
Réalisation d'une POC (Proof Of Concept) prouvant la faisabilité d'un widget canvas d'affichage de données coté front piloté par un serveur de type "Server-sent events".

## Contraintes techniques :
Nous attendons que vous livriez une archive (ex:zip/tgz) d'un repertoire contenant une démonstration fonctionnelle des différents objectifs comprenant un serveur en node.js et un exemple d'utilisation du widget (js) dans un contexte html.

Hormis ceci tous les choix d'outillages, api, documentation, test, normes, transpilation ou autres, sont à votre convenance. Gardez tout de même à l'idée qu'il ne s'agit pas de livrer un framework distribuable et finalisé mais bien une POC servant à démontrer la faisabilité technique des différentes couches, proposant une architecture AVANT d'éventuelles et ultérieures phases.

## Etat de l'art :
- [MDN / server-sent-events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [MDN / canvas](https://developer.mozilla.org/fr/docs/Web/API/Canvas_API)

## Objectifs

### Sous-objectifs 1 : (back)

- Réaliser un processus node.js contenant un serveur HTTP vanilla qui servira une page HTML (/index.html) de démonstration.
- ce serveur possedera également une route d'api /events de type *server-sent-events*  servant toutes les 3 à 10 secondes un même jeu de donnée à tous les clients potentiels via un event nommé "news".
- le jeu de données associé à l'event sera du type : { "value" : "AZFLIEB87Je", "time" : "02:34:23" } où *value* est une chaine aléatoire composée de lettres et de chiffres et time l'heure serveur.

### Sous-objectifs 2 : (front)
- les évènements reçus par la page depuis le serveur doivent être affichés sous forme de *canvas* dans la page en cours.
- le canvas fait une largeur et hauteur spécifiée à l'init du widget et la couleur de fond est une nuance de gris aléatoire.
- la valeur de l'event "value" est affichée en texte au centre de couleur lisible par rapport à la couleur de fond.
- l'heure de l'event est en coin en bas à droite de la même couleur que le texte.

### Sous-objectifs 3 : (front)
- élaborer un api pour le widget front sous forme de promise. L'initialisation de l'api consistera donc en une promesse qui sera tenue quand le serveur aura retourné un premier event à afficher (et pas avant) et offrant un handler à chaque nouvel event.
- implémenter deux instances du widget sur la page (avec des format différents) via un Promise.all

### Sous-objectifs 4 : (mixed) [ optionnel ]
- ajout de stats côté front au changement de display envois un hit coté backend ( event "DISPLAY" ).
- le backend archive les hits backend par id de plugin identifié dans la page.
- ajout d'une stat de log serveur en cas de premier survol par la souris d'un des canvas pendant plus de 2 secondes ( event "VIEWED" ).
- vous pouvez soit coder la chose soit nous décrire le principe d'une (ou plusieurs) solution(s).

### Sous-objectifs 5 : (back) [ optionnel ]
- ajout d'un outil en ligne de commande qui permet d'envoyer instantanément un message custom de la machine du server jusqu'au client (sans http).

