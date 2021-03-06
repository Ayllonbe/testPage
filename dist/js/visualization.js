function visual(data){


var gs2 = data.GS2;
//var reduceterm = data.Reduce;
var genes = data.GeneSet;
var Annotgenes = data.AnnotatedGeneSet;
var representative = data.representatives;
var scp = data.scp;
var dic = data.terms;
var org = data.organism;

scp.sort(function(a,b){
	return dic[a].IC - dic[b].IC
});
var recoverGenes = new Set();

representative.forEach(function(x){
dic[x].geneSet.forEach(function(g){
  recoverGenes.add(g);
});
})

var scpDic = [];
scp.forEach(function(x){
scpDic.push(dic[x]);

});


gauge(gs2,"#gs2");
var rg = Annotgenes.length/genes.length;
gauge(rg,"#recoverGenes");
if(org===""){
$(".rg").append('<p>'+(Math.round(rg*100))+ '% of genes are annotated within GOA.</p>');
}else if(org===undefined){
  $(".rg").append('<p>'+(Math.round(rg*100))+ '% of genes are annotated within GOA.</p>');
}else{
  org = org.replace("_", " ");
  $(".rg").append('<p>'+(Math.round(rg*100))+ '% of genes are annotated within ' +org+' GOA.</p>');
}
//gauge(reduceterm,"#reduce");
var rag = recoverGenes.size/Annotgenes.length;
$(".rag").append('<p>'+(Math.round(rag*100))+ '% of genes are covered by GSAn.</p>');
gauge(rag,"#recoverAnnotGenes");
$(".gs2").append('<p>The groupwise similarity between genes of the set is '+(Math.round(gs2*100))+ '%</p>');




barplot(scpDic,recoverGenes);

var h = ["GOID","Name","Ontology","IC","Covered genes","Synthetic"]
var r = [];
representative.forEach(function(x){
  //console.log(dic[x]);
  var cells = [];
  cells.push(x);
  cells.push(dic[x].name);
  cells.push(dic[x].onto);
  cells.push(Math.floor(dic[x].IC*100)/100);
  cells.push(dic[x].geneSet.length);

  if(scp.includes(x)){
	  cells.push(true);
  }else{
	  cells.push(false);
  }

r.push(cells);
})

$("#tableResult").append('<H3>GSAn retained '+representative.length+' terms, '+scp.length +' of them being synthetic<br>  ' +recoverGenes.size +' out of '+genes.length+' genes are covered</H3>');
var table = new Table()

//sets table data and builds it
table
    .setHeader(h)
    .setData(r)
    .setTableClass('table table-striped table-bordered')
    .setTableID('tableRep')
    .build()

//motvis(dic,representative,genes,data.tree);
var circulardiv = document.getElementById("circular"),
treediv = document.getElementById("treeHIDDEN"),
width = circulardiv.clientWidth,
height = circulardiv.clientHeight,
pack = d3.pack().size([width*0.9 , height*0.9]).padding(0.4);

console.log(width +" " + height);
motvis(dic,scp,genes,data.tree,width,height,pack,circulardiv,treediv,1);

  $(window).resize(function(){
    circulardiv = document.getElementById("circular"),
    treediv = document.getElementById("treeHIDDEN");
    if(width!==circulardiv.clientWidth || height!==circulardiv.clientHeight){
      width = circulardiv.clientWidth,
      height = circulardiv.clientHeight;
      motvis(dic,scp,genes,data.tree,width,height,pack,circulardiv,treediv,1);
    }

});


$(".selection").on('click', function() {
  // in the handler, 'this' refers to the box clicked on
  var $box = $(this);
  if ($box.is(":checked")) {
    // the name of the box is retrieved using the .attr() method
    // as it is assumed and expected to be immutable
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    // the checked state of the group/box on the other hand will change
    // and the current value is retrieved using .prop() method
    $(group).prop("checked", false);
    $box.prop("checked", true);
  } else {
    $box.prop("checked", false);
  }
   console.log($box[0].value);
    motvis(dic,scp,genes,data.tree,width,height,pack,circulardiv,treediv,$box[0].value);






});

function gauge(value,id) {
var gauge = gaugeChart()
.width(150)
.height(110)
.innerRadius(150/4)
.outerRadius((150 / 4) +20);

d3.select(id).datum([value]).call(gauge);



};
}
//console.log(json);
