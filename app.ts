import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import { createCanvas } from 'canvas'

// Fonction pour initialiser l'API du widget frontal
const initWidgetAPI = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/events',
      method: 'GET',
    }

    const req = http.request(options, (res) => {
      res.setEncoding('utf-8')
      res.on('data', (chunk) => {
        try {
          const eventData = JSON.parse(chunk)
          resolve(eventData)
        } catch (error) {
          console.error("Erreur lors de l'analyse du JSON:", error)
        }
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.end()
  })
}

// Fonction pour gérer les nouveaux événements
const handleNewEvent = (callback: { (newEvent1: any): void; (newEvent2: any): void; (arg0: any): void }) => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/events',
    method: 'GET',
  }

  const req = http.request(options, (res) => {
    res.setEncoding('utf-8')
    res.on('data', (chunk) => {
      const eventData = JSON.parse(chunk)
      callback(eventData)
    })
  })

  req.end()
}

// Création du serveur HTTP
const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  // Default
  let filePath: string = ''

  // Récupération du chemin de l'URL demandée
  if (__dirname && req.url) {
    const fileName = req.url === '/' ? '/index.html' : req.url
    filePath = path.join(__dirname, fileName)
  }

  // Si la demande est pour la route /events
  if (req.url === '/events') {
    // Définition des en-têtes pour Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    // Envoi périodique de données à intervalles de 3 à 10 secondes
    const sendData = async () => {
      const randomValue: string = generateRandomString() // Générer une chaîne aléatoire de 10 caractères
      const currentTime: string = getCurrentTime() // Obtenir l'heure actuelle au format HH:MM:SS
      const eventData = { value: randomValue, time: currentTime }

      // Dessiner les données sur le canvas
      const width = 600 // Largeur du canvas
      const height = 300 // Hauteur du canvas

      return await drawOnCanvas(eventData, res, width, height)
    }

    const interval = setInterval(sendData, getRandomInterval(3000, 10000))

    // Gérer la fermeture de la connexion
    req.on('close', () => {
      clearInterval(interval)
    })
  } else {
    // Lecture du fichier demandé
    fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      if (err) {
        // Si une erreur se produit (par exemple, fichier non trouvé), renvoyer une réponse 404
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('404 Not Found')
      } else {
        // Si le fichier est trouvé, renvoyer son contenu avec le bon type MIME
        const contentType: string = getContentType(filePath)
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      }
    })
  }
})

// Fonction pour obtenir le type MIME du fichier
const getContentType = (filePath: string): string => {
  const extname: string = path.extname(filePath)
  switch (extname) {
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    case '.js':
      return 'text/javascript'
    case '.json':
      return 'application/json'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    default:
      return 'text/plain'
  }
}

// Fonction pour générer un intervalle aléatoire entre min et max (en millisecondes)
const getRandomInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fonction pour générer une chaîne aléatoire de longueur donnée
const generateRandomString = () => {
  let result = ''
  // Générer 7 majuscules aléatoires
  for (let i = 0; i < 7; i++) {
    result += String.fromCharCode(65 + Math.floor(Math.random() * 26)) // ASCII pour les majuscules
  }
  // Générer 2 chiffres aléatoires
  for (let i = 0; i < 2; i++) {
    result += String.fromCharCode(48 + Math.floor(Math.random() * 10)) // ASCII pour les chiffres
  }
  // Générer 1 majuscule aléatoire
  result += String.fromCharCode(65 + Math.floor(Math.random() * 26)) // ASCII pour les majuscules
  // Générer 1 minuscule aléatoire
  result += String.fromCharCode(97 + Math.floor(Math.random() * 26)) // ASCII pour les minuscules

  return result
}

// Fonction pour obtenir l'heure actuelle au format HH:MM:SS
const getCurrentTime = (): string => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// Fonction pour dessiner les données sur le canvas
const drawOnCanvas = async (data: { value: string; time: string }, res: http.ServerResponse, width: number, height: number) => {
  const canvas = createCanvas(width, height) // Créez un canvas avec les dimensions souhaitées
  const ctx = canvas.getContext('2d')

  // Générer une nuance de gris aléatoire pour la couleur de fond
  const randomGray = Math.floor(Math.random() * 256)
  const backgroundColor = `rgb(${randomGray}, ${randomGray}, ${randomGray})`

  // Appliquer la couleur de fond
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Définir la couleur de texte en fonction de la luminosité de la couleur de fond
  const textColor = randomGray < 128 ? 'white' : 'black'

  // Dessiner la valeur de l'événement au centre du canvas
  ctx.fillStyle = textColor
  ctx.font = 'bold 30px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(data.value, canvas.width / 2, canvas.height / 2)

  // Dessiner l'heure de l'événement dans le coin en bas à droite
  ctx.fillText(data.time, canvas.width - 150, canvas.height - 30)

  // Convertir le canvas en un flux PNG et le renvoyer en réponse
  const stream = canvas.createPNGStream()
  res.writeHead(200, { 'Content-Type': 'image/png' })
  stream.pipe(res)
}

// Démarrage du serveur sur le port 3000
const port: number = 3000
server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}/`)
})

// Initialisation de la première instance du widget
const widget1Promise = initWidgetAPI()

// Initialisation de la deuxième instance du widget
const widget2Promise = initWidgetAPI()

// Utilisation de Promise.all pour attendre que les deux widgets soient prêts
Promise.all([widget1Promise, widget2Promise])
  .then(([firstEvent1, firstEvent2]) => {
    console.log('Premier événement du widget 1:', firstEvent1)
    console.log('Premier événement du widget 2:', firstEvent2)

    // Offrir un gestionnaire pour les nouveaux événements du widget 1
    handleNewEvent((newEvent1: any) => {
      console.log('Nouvel événement du widget 1:', newEvent1)
      // Mettre à jour l'interface utilisateur du widget 1 avec le nouvel événement
    })

    // Offrir un gestionnaire pour les nouveaux événements du widget 2
    handleNewEvent((newEvent2: any) => {
      console.log('Nouvel événement du widget 2:', newEvent2)
      // Mettre à jour l'interface utilisateur du widget 2 avec le nouvel événement
    })
  })
  .catch((err) => {
    console.error("Erreur lors de l'initialisation des widgets:", err)
  })
