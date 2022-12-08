from CarthaPirates import CarthaPirates
carthapirates = CarthaPirates(5) # Indiquez le numéro du bateau

for i in range(3):

  # Pour lister et choisir un port parmi tous les ports
  ports = carthapirates.listerTousLesPorts()
  for port in ports:
    print("Port n°", port["id"], ":", port["nom"])
  idPortChoisi = str(input("Dans quel port souhaitez-vous aller maintenant ? "))

  # Pour récupérer les coordonnées d'un port à partir de son identifiant
  coords = carthapirates.recupererCoordsPort(idPortChoisi) # On réutilise l'identifiant du port choisi
  print("Les coordonnées du port n°", idPortChoisi, "sont", coords)

  # Pour déplacer le bateau vers des coordonnées
  carthapirates.deplacerMonBateauVersCoords(coords) # On réutilise les coordonnées du port choisi
  print("Le bateau a bien été déplacé. Regardez la carte !")

# Pour récupérer les coordonnées du bateau
coords = carthapirates.recupererCoordsMonBateau()
print("Les coordonnées du bateau sont", coords)

# Pour rechercher les n ports à proximité de coordonnées
portsProches = carthapirates.trouverPortsProchesCoords(coords, 5) # On réutilise les coordonnées du bateau
for port in portsProches:
  print("Port n°", port["id"], ":", port["nom"], "(situé à", port["distance"], "miles nautiques du bateau)")
