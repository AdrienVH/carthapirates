from CarthaPirates import CarthaPirates
carthapirates = CarthaPirates(0) # Indiquez le numéro du bateau

def colorer(message, couleur):
  couleurs = { "vert": "\033[92m", "rouge": "\033[91m", "normal": "\033[0m" }
  return couleurs[couleur] + message + couleurs["normal"]

for i in range(5):

  # Pour lister et choisir un port parmi tous les ports
  ports = carthapirates.listerTousLesPorts()
  for port in ports:
    print(port["id"], ":", port["nom"])
  idPortChoisi = input(colorer("Dans quel port souhaitez-vous aller maintenant ? ", "rouge"))

  # Pour récupérer les coordonnées d'un port, à partir de son identifiant
  coords = carthapirates.recupererCoordsPort(idPortChoisi) # On réutilise l'identifiant du port choisi
  print("Les coordonnées du port n°", idPortChoisi, "sont", coords)

  # Pour déplacer le bateau vers des coordonnées
  carthapirates.deplacerMonBateauVersCoords(coords) # On réutilise les coordonnées du port choisi
  print(colorer("Le bateau a bien été déplacé. Regardez la carte !", "vert"))

# Pour récupérer les coordonnées du bateau
coords = carthapirates.recupererCoordsMonBateau()
print("Les coordonnées du bateau sont", coords)

# Pour rechercher les n ports à proximité de coordonnées
portsProches = carthapirates.trouverPortsProchesCoords(coords, 5) # On réutilise les coordonnées du bateau
for port in portsProches:
  print(port["id"], ":", port["nom"], "(situé à", port["distance"], "milles nautiques du bateau)")

# Pour retirer le bateau et ses trajets de la carte à la fin de votre programme
confirmation = input(colorer("Souhaitez-vous arrêter ? [Y/n] ", "rouge"))
if confirmation == "Y":
  carthapirates.rentrerMonBateau()
  print(colorer("Le bateau et ses trajets ont bien été retirés. Regardez la carte !", "vert"))
else:
  carthapirates.rentrerMonBateau()
  print(colorer("Et bha le bateau et ses trajets ont quand même été retirés. Na ! Regardez la carte !", "vert"))