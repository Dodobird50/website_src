window._ = {
	chart: {},
	colA: {},
	colB: {},
	timeTravel: {},
	translate: {},

	dataDisplayHeaderHTMLs: [
        '<div id="dataDisplayHeader" class="row">'
            +'<div><br>Rank</div>'
            +'<div><br>State/territory</div>'
            +'<div><br>Total cases</div>'
            +'<div>Per 100,000 people</div>'
            +'<div>7 day average <br>of new cases</div>'
            +'<div>Per 100,000 people</div>'
            +'<div><br>Total deaths</div>'
            +'<div>Updated today?</div>'
        +'</div>',
        
        '<div id="dataDisplayHeader" class="row">'
            +'<div><br><br>Rango</div>'
            +'<div><br><br>Estado/territorio</div>'
            +'<div><br><br>Casos totales</div>'
            +'<div><br>Por 100.000 personas</div>'
            +'<div>Promedio de 7 días de casos nuevos</div>'
            +'<div><br>Por 100.000 personas</div>'
            +'<div><br>Muertes totales</div>'
            +'<div><br>¿Actualizado hoy?</div>'
        +'</div>',
        
        '<div id="dataDisplayHeader" class="row">'
            +'<div><br>排名</div>'
            +'<div><br>州/领土</div>'
            +'<div><br>累计确诊</div>'
            +'<div><br>每10万人中</div>'
            +'<div>新确诊的7天<br>平均</div>'
            +'<div><br>每10万人中</div>'
            +'<div><br>累计死亡</div>'
            +'<div>今天更新了吗？</div>'
        +'</div>',
            
        '<div id="dataDisplayHeader" class="row">'
            +'<div><br><br>Rang</div>'
            +'<div><br><br>État/territoire</div>' 
            +'<div><br>Nombre total des cas</div>'
            +'<div><br>Pour 100&nbsp;000 personnes</div>'
            +'<div>Moyenne sur <br>7 jours de nouveaux cas</div>'
            +'<div><br>Pour 100&nbsp;000 personnes</div>'
            +'<div><br>Nombre total des décès</div>'
            +'<div><br>Mis à jour aujourd\'hui?</div>'
        +'</div>',
        
        '<div id="dataDisplayHeader" class="row" onmouseenter="displayNationalStats()">'
            +'<div><br>ランク</div>'
            +'<div><br>州/領土</div>'
            +'<div><br>累積診断</div>' 
            +'<div>10万人あたりの</div>'
            +'<div>新たに診断の7日間の平均</div>'
            +'<div>10万人あたりの</div>'
            +'<div><br>累積死亡</div>' 
            +'<div>今日更新しましたか？</div>'
        +'</div>'
    ],
    lg: "lightgray", b: "black"
};