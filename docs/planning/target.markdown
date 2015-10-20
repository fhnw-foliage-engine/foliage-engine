##Projektziele

###1. Billboard
#####Ausgangslage
Zurzeit hat die Foliage-Engine 4 verschiedene LOD. LOD1 bis LOD3 sind Objekte mit jeweils entsprechend reduzierter Vertices. LOD4 ist nur eine Textur.
#####Auftrag 
Unser Auftrag ist es, LOD3 durch eine Billboarddarstellung zu ersetzen, um so die Performance der Foliage-Engine zu steigern.
###2. Octree
#####Ausgangslage
Bei der aktuellen Foliage-Engine wurde versucht, mit Octree eine Performancesteigerung zu erzielen. Allerdings wurde nur eine minimale Verbesserung erreicht.
#####Auftrag
Unser Auftrag ist es, den Zeitverlust für die Berechnung der Distanz zu den einzelenen Gras-Objekten zu ermitteln. Falls dieser auffällig gross ausfällt, sollen wir untersuchen, ob wir eine Verbesserung mit Octree erzielen können.
###3. Dynamic Terrain
#####Ausgangslage
Im jetzigen Zeitpunkt ist das Example der Foliage-Engine lediglich eine begrenzte Fläche, die man sehen und sich darauf bewegen kann.
#####Auftrag
Unser Auftrag ist es, eine dynamische, unendliche Fläche zu erzeugen, bei der man einen besseren Eindruck über die Leistung der Engine erhalten kann. Egal in welche Richtung und wie lange man sich bewegt, es soll immer das volle Sichtfeld mit Gras voll sein.
