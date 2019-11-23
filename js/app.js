function clickForm() {
    calcolaDiritti();
	// impedisce l'invio del form
    return false;
}

function arrotonda(x) {
	let y = Math.round(x * 100) / 100;
	return y.toFixed(2);
}

function int2X(valore) {
	let X = "";
	for(let i = 0; i<valore; i++) {
		X = X + "X";
	} 
	return X;
}

function calcolaDiritti() {

		// CARICAMENTO VALORI
	costostampaunita = Number($("#costostampaunita").val());
	tiratura = Number($("#tiratura").val());
	costocorrezione = Number($("#costocorrezione").val());
	costoimpaginazione = Number($("#costoimpaginazione").val());
	costografica = Number($("#costografica").val());
	perScontoDiretta = Number($("#perScontoDiretta").val() / 100);
	spedizione = Number($("#spedizione").val());
	perLibreria = Number($("#perLibreria").val() / 100);
	perScontoLibreria = Number($("#perScontoLibreria").val() / 100);
	perDistributore = Number($("#perDistributore").val() / 100);
	perScontoDistributore = Number($("#perScontoDistributore").val() / 100);
	prezzo = Number($("#prezzo").val());
	diritti = Number($("#diritti").val() / 100);
	str_iva = Number($('input[name="iva"]:checked').val());
	eta = Number($('input[name="eta"]:checked').val());
	quantita = Number($("#Quantita").val());
	perspesegenerali = Number($("#perSpeseGenerali").val() / 100);
	
	qtautore = Number($("#qtAutore").val());
	perscontoautore = Number($("#perScontoAutore").val() / 100);
	
	perguasti = Number($("#perGuasti").val() / 100);
		
	// CALCOLO QUANTITA LIBRI VENDUTI IN BASE PERCENTUALI IMMESSE
	qtlibreria = Math.round(quantita * perLibreria);
	$("#qtLibreria").val(qtlibreria.toFixed(0));
	qtdistributore = Math.round(quantita * perDistributore);
	$("#qtDistributore").val(qtdistributore.toFixed(0));
	qtguasti = Math.round(perguasti * quantita);
	
	// VERIFICHE DATI IMMESSI
	if(tiratura<quantita) { 
		alert("Attenzione quantità venduta minore di quella stampata"); 
	}
	if((perLibreria+perDistributore+perguasti)>1) { 
		alert("Attenzione percentuali librerie, distribuzione e guasti troppo alte"); 
	}
	if((quantita - qtlibreria - qtdistributore - qtautore - qtguasti)<0) {
		alert("Attenzione quantità libri venduti troppo alte"); 
	}		
	
	// CALCOLO DIRITTI D'AUTORE
	prezzoSenzaDiritti = prezzo * (1);
	lordoSpettante = prezzoSenzaDiritti * diritti;
	
	iva = 0.04;
		
	defalcazioneIVA = lordoSpettante / (1+iva);
	
	baseImponibile = defalcazioneIVA * eta;
	ritenuta = baseImponibile * 0.20;
	compensoNetto = defalcazioneIVA - ritenuta;
	
	totaleritenuta = quantita * ritenuta;
	totalecompenso = quantita * compensoNetto;
	totalelordo = totalecompenso+totaleritenuta;
		
	// CALCOLO CREAZIONE LIBRO
	costiStampa = tiratura * costostampaunita;
	
	if(str_iva == "1") {
		totaleIVA = 0.7 * (tiratura * prezzo) - (0.7* tiratura * prezzo)/(1+iva);
	} else {
		totaleIVA = quantita * prezzo - (quantita * prezzo)/(1+iva);
	}
	
	totaleCostiLavorazione = costocorrezione + costoimpaginazione + costografica;
	totaleSpeseGenerali = perspesegenerali * totaleCostiLavorazione;
	
	totaleCostiCreazione = costiStampa + totaleIVA + costocorrezione + costoimpaginazione + costografica + totaleSpeseGenerali;
	
	// GUADAGNI
	totaleGuadagnoLibreria = qtlibreria * perScontoLibreria * prezzo;
	totaleLibreria = qtlibreria * (1-perScontoLibreria) * prezzo;
	
	totaleGuadagnoDistributore = qtdistributore * perScontoDistributore * prezzo;
	totaleDistributore = qtdistributore * (1-perScontoDistributore) * prezzo;
	
	totaleGuadagnoAutore = qtautore * perscontoautore * prezzo;
	totaleAutore = qtautore * (1-perscontoautore) * prezzo;
		
	qtcasa = quantita - qtlibreria - qtdistributore - qtautore - qtguasti;
	totalecasa = qtcasa * prezzo * (1-perScontoDiretta);
		
	// COSTI
	totaleCosti = totaleCostiCreazione + totalelordo + spedizione;
	// RICAVI
	totaleRicavi = totaleLibreria + totaleDistributore + totalecasa + totaleAutore;
	// GUADAGNO
	totaleGuadagno = totaleRicavi - totaleCosti;
	
	// STATISTICHE
	stattotale = costiStampa + totaleCostiLavorazione + totalelordo + totaleGuadagnoAutore + totaleGuadagnoLibreria + totaleGuadagnoDistributore + totaleGuadagno;
	stattipografia = costiStampa/stattotale;
	statlavorazione = totaleCostiLavorazione/stattotale;
	statautore = (totalelordo + totaleGuadagnoAutore)/stattotale;
	statlibrerie = totaleGuadagnoLibreria/stattotale;
	statdistributore = totaleGuadagnoDistributore/stattotale;
	statcasaeditrice = totaleGuadagno/stattotale;
		
	// SCRIVO I RISULTATI
	$("#risultatiStampa").html("<h2>COSTI CREAZIONE LIBRO</h2>");
	$("#risultatiStampa").append("Costo di stampa: " + costiStampa.toFixed(2) + " €<br>");
	if(str_iva == "1") {
			$("#risultatiStampa").append("IVA (resa forfettaria 70% tiratura cartaceo): " + totaleIVA.toFixed(2) + " €<br>");
		} else {
			$("#risultatiStampa").append("IVA (calcolata su ebook venduti): " + totaleIVA.toFixed(2) + " €<br>");
		}
	$("#risultatiStampa").append("Costi di lavorazione (correzione,imp.,grafica): " + totaleCostiLavorazione.toFixed(2) + " €<br>");
	$("#risultatiStampa").append("Spese generali sui costi lavorazione: " + totaleSpeseGenerali.toFixed(2) + " €<br>");
	$("#risultatiStampa").append("Costi totali prodotto finito: " + totaleCostiCreazione.toFixed(2) + " €<br>");	
		
	$("#risultatiDiritti").html("<h2>DIRITTI D'AUTORE PER "+quantita+" LIBRI</h2>");
	$("#risultatiDiritti").append("Ritenuta d'acconto (tramite F24): " + totaleritenuta.toFixed(2) + " €<br>");
	$("#risultatiDiritti").append("Compenso netto (spettante all'autore): " + totalecompenso.toFixed(2) + " €<br>");
	$("#risultatiDiritti").append("Compenso lordo: " + totalelordo.toFixed(2) + " €<br>");
	
	$("#risultatiLibreria").html("<h2>LIBRERIE PER "+qtlibreria+" LIBRI</h2>");
	$("#risultatiLibreria").append("Guadagno della libreria: " + totaleGuadagnoLibreria.toFixed(2) + " €<br>");
	$("#risultatiLibreria").append("Guadagno casa editrice: " + totaleLibreria.toFixed(2) + " €<br>");
	
	$("#risultatiDistributore").html("<h2>DISTRIBUTORE PER "+qtdistributore+" LIBRI</h2>");
	$("#risultatiDistributore").append("Guadagno del distributore: " + totaleGuadagnoDistributore.toFixed(2) + " €<br>");
	$("#risultatiDistributore").append("Guadagno casa editrice: " + totaleDistributore.toFixed(2) + " €<br>");
	
	$("#risultatiAutore").html("<h2>AUTORE PER "+qtautore+" LIBRI</h2>");
	$("#risultatiAutore").append("Guadagno dell'autore: " + totaleGuadagnoAutore.toFixed(2) + " €<br>");
	$("#risultatiAutore").append("Guadagno casa editrice: " + totaleAutore.toFixed(2) + " €<br>");
	
	$("#risultatiCasa").html("<h2>CASA EDITRICE PER "+qtcasa+" LIBRI</h2>");
	$("#risultatiCasa").append(qtguasti + " omaggi e guasti: -" + (qtguasti*prezzo).toFixed(2) + " €<br>");
	$("#risultatiCasa").append("Guadagno casa editrice: " + totalecasa.toFixed(2) + " €<br>");
	
	$("#risultatiCosti").html("<h1>COSTI</h1>");
	$("#risultatiCosti").append("Totale: " + totaleCosti.toFixed(2) + " €<br>");
	
	$("#risultatiRicavi").html("<h1>RICAVI</h1>");
	$("#risultatiRicavi").append("Totale: " + totaleRicavi.toFixed(2) + " €<br>");
	
	$("#risultatiGuadagno").html("<h1>UTILE</h1>");
	$("#risultatiGuadagno").append("Totale: " + totaleGuadagno.toFixed(2) + " €<br>");
	
	$("#risultatiStatistiche").html("<h2>STATISTICHE RICAVI</h2>");
	$("#risultatiStatistiche").append("Totale movimentato: " + stattotale.toFixed(2) + " €<br>");
	$("#risultatiStatistiche").append("% Ricavi vari attori<br>");
	$("#risultatiStatistiche").append("Tipografia___: " + (stattipografia*100).toFixed(2) + " %<br>");
	$("#risultatiStatistiche").append("Lavorazione__: " + (statlavorazione*100).toFixed(2) + " %<br>");
	$("#risultatiStatistiche").append("Autore_______: " + (statautore*100).toFixed(2) + " %<br>");
	$("#risultatiStatistiche").append("Librerie_____: " + (statlibrerie*100).toFixed(2) + " %<br>");
	$("#risultatiStatistiche").append("Distributore_: " + (statdistributore*100).toFixed(2) + " %<br>");
	$("#risultatiStatistiche").append("Casa editrice: " + (statcasaeditrice*100).toFixed(2) + " %<br>");
	
	// GRAFICO
	
	let dimDivMax = Math.max.apply(Math, $('#risultatiGrafico').map(function(){ return $(this).width(); }).get());
	
	$("#risultatiGrafico").html("<h2>GRAFICO</h2>");
	$("#risultatiGrafico").append("<br><br>");
	
	dimX = 10;
	let datigrafico = {
		dati: [stattipografia*100, statlavorazione*100, statautore*100, statlibrerie*100, statdistributore*100, statcasaeditrice*100],
		label: ["Tipografia", "Lavorazione", "Autore", "Libreria", "Distribuzione", "Casa editrice"],
		stringhe: ["", "", "", "", "", ""]
	};
	
		
	for(let c = 0; c < datigrafico.dati.length; c++ ) {
		//datigrafico.stringhe[c] = int2X(Math.round(datigrafico.dati[c]));
		$("#risultatiGrafico").append("<span class='grafico'>" + int2X(Math.round(datigrafico.dati[c])) + "</span>: " + datigrafico.label[c] + "<br>");
		
	}
	
	
}
