##Projektziele

###1. Billboard
#####Ausgangslage
Zur Zeit hat die Foliage-engine 4 verschiedene LOD. LOD1 bis LOD3 sind Objekte mit jedoch jeweils entsprechend reduzierter Vertices. LOD4 ist eine Textur
#####Auftrag 
Unser Auftrag ist es nun LOD3 durch eine Billboarddarstellung zu ersetzen, um so die Performance der Foliage-engine zu steigern.
###2. Octree
#####Ausgangslage
Bei der aktuellen Foliage-engine wurde mit Octree eine Performancesteigerung versucht, jedoch wurden nur minimale Verbesserung erzielt.
#####Auftrag
Unser Autftag ist es den Zeitverlust für die Berechnung der Distanz zu den einzelenen Grassobjekten zu ermitteln. Falls dieser auffällig gross ausfällt, sollen wir eine Verbesserung mit Octree untersuchen.
###3. Dynamic Terrain
#####Ausgangslage
Im jetztigen Zeitpunkt ist das example der Foliage-engine lediglich eine begrenzte Fläche die man sehen und sich darauf bewegen kann.
#####Auftrag
Unser Auftrag ist es nun eine dynamische, unendliche Fläche zu erzeugen, bei der man einen besseren Eindruck über die Leistung der Engine erhalten kann. Egal in welche Richtung, und wie lange man sich bewegt, es soll immer das volle Sichtfeld mit Gras voll sein.
