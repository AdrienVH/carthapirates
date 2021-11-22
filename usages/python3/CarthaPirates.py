import requests
class CarthaPirates(object):
  def __init__(self, idBateau):
    self.monBateau = idBateau
    self.url = "http://api.carthapirates.adrienvh.fr"
  def listerTousLesPorts(self):
    response = requests.get(self.url + "/sites")
    return response.json()
  def deplacerMonBateauVersCoords(self, coords):
    query = {"longitude":coords[0], "latitude":coords[1]}
    requests.put(self.url + '/moyen/' + str(self.monBateau), params=query)
  def recupererCoordsPort(self, idPort):
    response = requests.get(self.url + "/site/"+ str(idPort))
    return response.json()["geom"]["coordinates"]
  def recupererCoordsMonBateau(self):
    response = requests.get(self.url + "/moyen/"+  str(self.monBateau))
    return response.json()["geom"]["coordinates"]
  def trouverPortsProchesCoords(self, coords, nombre):
    url = self.url + "/sites/nearest/" + str(nombre) + "/" + str(coords[0]) + "/" + str(coords[1])
    response = requests.get(url)
    return response.json()
  def trouverBateauxProchesCoords(self, coords, nombre):
    url = self.url + "/moyens/nearest/" + str(nombre) + "/" + str(coords[0]) + "/" + str(coords[1])
    response = requests.get(url)
    return response.json()
