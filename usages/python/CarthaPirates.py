import os
import requests

class CarthaPirates(object):

  def __init__(self, idBateau):
    self.monBateau = idBateau
    self.init = False
    self.setApiUrl()

  def setApiUrl(self):
    dir = os.path.dirname(os.path.realpath(__file__))
    isDev = os.path.exists("{}/dev".format(dir))
    if isDev:
      self.url = "http://localhost:9001"
    else:
      self.url = "https://carthapirates.fr/api"

  def listerTousLesPorts(self):
    url = self.url + "/ports"
    response = requests.get(url)
    return response.json()

  def deplacerMonBateauVersCoords(self, coords):
    url = self.url + '/bateaux/' + str(self.monBateau)
    params = { "longitude": coords[0], "latitude": coords[1] }
    requests.put(url, params=params)

  def recupererCoordsPort(self, idPort):
    url = self.url + "/ports/" + str(idPort)
    response = requests.get(url)
    return response.json()["geom"]["coordinates"]

  def recupererCoordsMonBateau(self):
    url = self.url + "/bateaux/" +  str(self.monBateau)
    response = requests.get(url)
    return response.json()["geom"]["coordinates"]

  def trouverPortsProchesCoords(self, coords, nombre):
    url = self.url + "/ports/proches/" + str(nombre) + "/" + str(coords[0]) + "/" + str(coords[1])
    response = requests.get(url)
    return response.json()

  def trouverBateauxProchesCoords(self, coords, nombre):
    url = self.url + "/bateaux/proches/" + str(nombre) + "/" + str(coords[0]) + "/" + str(coords[1])
    response = requests.get(url)
    return response.json()

  def supprimerLesTrajetsDeMonBateau(self):
    url = self.url + "/trajets/" + str(self.monBateau)
    requests.delete(url)

  def placerMonBateauDansUnPort(self):
    self.listerTousLesPorts()
    ports = self.listerTousLesPorts()
    for port in ports:
      print("Port n°", port["id"], ":", port["nom"])
    idPortChoisi = str(input("\nDans quel port souhaitez-vous commencer votre aventure ? "))
    coords = self.recupererCoordsPort(idPortChoisi)
    self.placerMonBateauAuxCoords(coords)
  
  def placerMonBateauAuxCoords(self, coords):
    self.deplacerMonBateauVersCoords(coords)
    self.supprimerLesTrajetsDeMonBateau()
    self.init = True
