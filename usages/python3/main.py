from CarthaPirates import CarthaPirates
carte = CarthaPirates(2) # Indiquez le numéro de votre binôme/bateau

# Pour lister tous les ports
print("----------------------- Exemple 1 -----------------------\n")
ports = carte.listerTousLesPorts()
for port in ports:
  print("Le port", port["id"], "est situé à", port["nom"])
idPortChoisi = str(input("\nDans quel port souhaitez-vous commencer votre aventure ? "))

# Pour récupérer les coordonnées d'un port à partir de son identifiant
print("\n----------------------- Exemple 2 -----------------------\n")
coords = carte.recupererCoordsPort(idPortChoisi) # On réutilise l'identifiant du port choisi
print("Les coordonnées du port", idPortChoisi, "sont", coords)

# Pour déplacer un bateau vers des coordonnées
print("\n----------------------- Exemple 3 -----------------------\n")
carte.deplacerMonBateauVersCoords(coords) # On réutilise les coordonnées du port choisi
print("Mon bateau a bien été déplacé. Regardez la carte !")

# Pour récupérer les coordonnées de mon bateau
print("\n----------------------- Exemple 4 -----------------------\n")
coords = carte.recupererCoordsMonBateau()
print("Les coordonnées de mon bateau sont", coords)

# Pour rechercher les ports à proximité de coordonnées
print("\n----------------------- Exemple 5 -----------------------\n")
portsProches = carte.trouverPortsProchesCoords(coords, 6) # On réutilise les coordonnées de mon bateau
portsProches.pop(0) # Je supprime l'élément qui est à la position 0 (le port où se trouve mon bateau)
for port in portsProches:
  print(port["id"], "-", port["nom"], "est situé à", int(port["distance"] / 1000), "km de mon bateau")

# Pour déplacer un bateau vers des coordonnées
print("\n----------------------- Exemple 6 -----------------------\n")
carte.deplacerMonBateauVersCoords([2, 48])
print("Mon bateau a bien été déplacé. Regardez la carte !")
