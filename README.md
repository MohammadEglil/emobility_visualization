# Datenverarbeitung

Der Ordner Rohdaten enthält alle gebrauchten Daten in unverarbeiteter Form. Diese stammen alle vom Bundesamt für Statistik und wurden unter der Lizenz Open by Ask verwendet.

## Anteil Elektroautos

Die Daten für die Gemeindekarte wurden direkt aus dem CSV [Anteil_Elektroauto_Gemeinden](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/Anteil_Elektroauto_Gemeinden.csv) entnommen, welche auf beim [BFS publizert wurden](https://www.bfs.admin.ch/bfs/de/home/statistiken/mobilitaet-verkehr/verkehrsinfrastruktur-fahrzeuge/fahrzeuge/strassenfahrzeuge-bestand-motorisierungsgrad.assetdetail.24065050.html). Analog für das Balkendiagramm der Kantone wurde das CSV [Anteil_Elektroauto_Kantone](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/Anteil_Elektroauto_Kantone.csv) genutzt.

## Anteil Neuzulassungen

Die Daten für das Liniendiagramm wurden direkt aus dem Excel File [Neuzulassungen_T1.2](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/Neuzulassungen_T1.2.xlsx) wobei hierfür das Blaat mit Namen T1.2 verwendet wurde.

## Ladestationeninfrastruktur

Für die Kantonskarte Elektroautos pro Ladestation wurden für die Anzahl Elektroautos die absolute Zahl aus dem CSV [Anteil_Elektroauto_Kantone](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/Anteil_Elektroauto_Kantone.csv) entnommen. Die Anzahl Ladestationen wurden direkt aus der [Tabelle von Swiss eMobility](https://datawrapper.dwcdn.net/2mCg9/41/) entnommen, welche vom Verband mittels des Jsons [Ladestationen](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/Ladestationen.json), das aus dem [Open Data Portal](https://opendata.swiss/de/dataset/ladestationen-fuer-elektroautos) stammt, verarbeitet wurde. 
Für die Karte Ladestationen pro 100km Strasse wurde das Wegnetz pro Kanton aus der Excel Datei [Länge Verkehrsnetz](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/La%CC%88nge_Verkehrsnetz.xlsx) ermittelt.

## Motorisierungsgrad

Analog zum Anteil Elektroautos wurden die Daten direkt aus dem CSV [Motorisierungsgrad_Kantone](https://github.com/MohammadEglil/emobility_visualization/blob/main/Rohdaten/Motorisierungsgrad_Kantone.csv), welche auf der [Webseite des BFS](https://www.bfs.admin.ch/bfs/de/home/statistiken/mobilitaet-verkehr/verkehrsinfrastruktur-fahrzeuge/fahrzeuge/strassenfahrzeuge-bestand-motorisierungsgrad.assetdetail.24045546.html) zu finden sind, entnommen.
