estados = []
alfabeto = []
estado_incial = ""
estados_finais = []

cadeia = [];
transicoes = [];

canvas_x = 1000
canvas_y = 1000

canvas_items = new Map()
canvas_spacing = 200

estados_pos = []

function nomeiaSubconjunto(arr) {
    if (!arr || arr.length === 0) return "∅";
    // filtra vazios (caso existam)
    let itens = arr.filter(x => x !== "" && x !== undefined && x !== null);
    if (itens.length === 0) return "∅";
    return itens.sort().join("_");
}

function attTabelaFunc() {
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    estados.forEach(estado => {
        let row = tbody.insertRow();
        let h = document.createElement('th');
        h.textContent = estado;
        row.prepend(h)
        alfabeto.forEach(_ => {
            cell = row.insertCell()
            cell.setAttribute("contenteditable", "true")
            cell.addEventListener("input", function(e) {
                desenhaTransicao("tela_AFN");
            });
        })

    });

    let linhaCabec = document.createElement('tr');

    let simbolo = document.createElement('th');
    simbolo.setAttribute("style", "width: 2rem")
    simbolo.textContent = "δ"
    linhaCabec.appendChild(simbolo)

    alfabeto.forEach(letra => {
        let h = document.createElement('th');
        h.textContent = letra
        linhaCabec.appendChild(h)
    })

    thead.appendChild(linhaCabec)

    

    document.querySelector("#tabelaDelta tbody").replaceWith(tbody)
    document.querySelector("#tabelaDelta thead").replaceWith(thead)

    desenhaTransicao("tela_AFN")
    
}

function desenhaEstados(id_tabela) {
    const canvas = document.getElementById(id_tabela);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height)

    let posX = canvas_spacing
    let posY = canvas_spacing

    estados.forEach(estado => {
        canvas_items.set(estado,(posX,posY))
        estadoDraw(estado, posX, posY, id_tabela)
        estados_pos.push([estado, posX, posY])
        posX = posX+canvas_spacing
        if (posX > canvas_x-50) {
            posY = posY+canvas_spacing
            posX = canvas_spacing
        }
    })
}

function desenhaTransicao(id_tabela) {
    const tabTransicao = document.getElementById("tabelaDelta")
    let linhaCabec = tabTransicao.rows[0]
    const canvas = document.getElementById(id_tabela);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height)
    desenhaEstados(id_tabela)

    let setas = []

    for (var i = 1, row; row = tabTransicao.rows[i]; i++) {
        for (var j = 1, col; col = linhaCabec.cells[j]; j++) {
            let coluna = col.textContent;
            let linha = row.cells[0].textContent;
            let valor = row.cells[j].textContent.split(",");
            let concatenado = false

            valor.forEach(estado => {
                if (estado.length > 0 && estados.includes(estado)) {

                    for (x=0;x<setas.length;x++) {
                        console.log(setas[x])
                        if ((setas[x][1] == linha) && (setas[x][2] == estado)) {
                            console.log(`Encontrei ${linha} e ${estado} na coluna ${setas[x][3][0]} também`)
                            let substituto = [ctx, linha, estado, [coluna].concat(setas[x][3])]
                            setas[x] = substituto;
                            concatenado = true;
                        }
                    }

                    if (!concatenado) {
                        setas.push([ctx, linha, estado, [coluna]])
                    }
                    console.log(setas)
                    
                    /*console.log(`Estado ${linha} recebendo ${coluna} vai para ${valor}`)*/
                }
            })
            
                
        }
    }
    setas.forEach(seta => {
        desenhaSeta(seta[0], seta[1], seta[2], seta[3]);
    })
}

function getEstadoPos(estado) {
    let x = null
    let y = null
    estados_pos.forEach(est => {
        if (est[0] == estado) {
            x = est[1]
            y = est[2]
        }
    })
    return [x, y]
}

function desenhaSeta(ctx, de, para, letras) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    let espacamento = 20;

    let [deX,deY] = getEstadoPos(de);
    let [paraX,paraY] = getEstadoPos(para);

    console.log(letras)

    if (de == para) {
        ctx.arc(deX-60, deY+60, 20, 0, Math.PI+(Math.PI/2))
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(deX-60, deY+40, 5, 0, 2*Math.PI)
        ctx.fill()
        ctx.font = "28px serif";
        for (i = 0; i < letras.length; i++) {
            ctx.fillText(letras[i], deX-65+(espacamento*i)-(espacamento*letras.length/2),deY+110);
        }
        
        ctx.closePath(); 
    } else if (estados.includes(para)) {
        if (paraX-deX > 50+canvas_spacing) {
            ctx.moveTo(deX, deY+50);
            ctx.lineTo(deX, deY+75);
            ctx.lineTo(paraX, paraY+75);
            ctx.lineTo(paraX, paraY+50);

            ctx.stroke();
            ctx.font = "28px serif";
            for (i = 0; i < letras.length; i++) {
                ctx.fillText(letras[i], paraX-deX+(espacamento*i)-(espacamento*letras.length/2),deY+100);
            }
            ctx.closePath();

            ctx.beginPath();

            const angle = Math.PI/6;

            ctx.moveTo(paraX+8, paraY+65);
            ctx.lineTo(paraX+8 - 15 * Math.cos(angle - Math.PI / 6), paraY+65 - 15 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(paraX+8 - 15 * Math.cos(angle + Math.PI / 6), paraY+65 - 15 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

        } else if(paraX<deX) {
            ctx.moveTo(deX, deY-50);
            ctx.lineTo(deX, deY-75);
            ctx.lineTo(paraX, paraY-75);
            ctx.lineTo(paraX, paraY-50);
            ctx.stroke();
            ctx.font = "28px serif";
            for (i = 0; i < letras.length; i++) {
                ctx.fillText(letras[i], paraX+(deX-paraX)/2+(espacamento*i)-(espacamento*letras.length/2),deY-100);
            }
            ctx.closePath();
            ctx.beginPath();

            const angle = Math.PI/2;

            ctx.moveTo(paraX, paraY-50);
            ctx.lineTo(paraX - 15 * Math.cos(angle - Math.PI / 6), paraY-50 - 15 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(paraX - 15 * Math.cos(angle + Math.PI / 6), paraY-50 - 15 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

        } else {
            ctx.moveTo(deX+50, deY);
            ctx.lineTo(paraX-50, paraY);
            ctx.stroke();
            ctx.font = "28px serif";
            for (i = 0; i < letras.length; i++) {
                ctx.fillText(letras[i], deX+(paraX-deX)/2+(espacamento*i)-(espacamento*letras.length/2),deY+25);
                console.log(paraX);
                console.log(deX);
            }
            ctx.closePath()

            ctx.beginPath()

            const angle = Math.atan2(paraY - deY, paraX-deX);

            ctx.moveTo(paraX-50, paraY);
            ctx.lineTo(paraX-50 - 15 * Math.cos(angle - Math.PI / 6), paraY - 15 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(paraX-50 - 15 * Math.cos(angle + Math.PI / 6), paraY - 15 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        }

    }
    
}

function estadoDraw(nome, x, y, id_tabela) {
    let inicial = estado_incial == nome;
    let final = estados_finais.includes(nome);

    const canvas = document.getElementById(id_tabela);
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, 2*Math.PI)
    ctx.stroke();

    if (final) {
        ctx.arc(x, y, 45, 0, 2*Math.PI)
        ctx.stroke();
    }
    
    ctx.closePath();
    ctx.font = "28px serif";
    ctx.fillText(nome, x-12, y+5);

    if (inicial) {
        ctx.beginPath();
        ctx.moveTo(x-60, y);
        ctx.lineTo(x-80,y-20);
        ctx.lineTo(x-80,y+20);
        ctx.lineTo(x-60, y);
        ctx.stroke();
        ctx.closePath();
    }
}


function validaEstados() {
    let entrada = document.getElementById("conjunto_de_estados");
    let formatado = entrada.value.replace(/\s+/g,"");
    let conjunto = formatado.split(',');

    estados = conjunto

    return conjunto
}

function validaAlfabeto() {
    let entrada = document.getElementById("alfabeto");
    let formatado = entrada.value.replace(/\s+/g,"");
    let conjunto = formatado.split(',');

    alfabeto = conjunto

    return conjunto
}

function validaFinais() {
    let entrada = document.getElementById("conjunto_de_estados_finais");
    let formatado = entrada.value.replace(/\s+/g,"");
    let conjunto = formatado.split(',');

    estados_finais = conjunto

    return conjunto
}

function recebeEInicial() {
    estado_incial = document.getElementById("estado_inicial").value.replace(/\s+/g, "");
}

function recebeCadeia() {
    let entrada = document.getElementById("cadeia");
    let formatado = entrada.value.replace(" ","").replace(",", "");
    let conjunto = formatado.split('');
 
    cadeia = conjunto

    return conjunto
}

function validaCadeia() {
    getInfoTable();
    
    var estados_atuais = [estado_incial];
    var estados_aux = []
    let estados_afd = [estado_incial]

    for(var c = 0; c<cadeia.length; c++) {
        estados_atuais.forEach(estado_atual => {
            tesao = transicoes.filter((t) => (t[1] == cadeia[c]) && (t[2] == estado_atual));
            tesao.forEach(element => {
                estados_aux.push(...element[0])
             });
        })
        estados_atuais = estados_aux
        estados_afd.push([...estados_atuais].join(""))
        
        estados_aux = []
    }

    console.log(estados_atuais)
    criaADF(new Set(estados_atuais))

    let val = false

    estados_atuais.forEach(est => {
        console.log(est)
        console.log(estados_finais)
        if (estados_finais.includes(est)) {
            console.log("Tem estado no final")
            val = true
        }
    })

    return val
    
}

function criaADF(estadosADF) {

    let inicialAFD = nomeiaSubconjunto([...estadosADF]);
    let estadosAFD = [inicialAFD];
    let pendentes = [inicialAFD];

    let transAFD = {};  

    while (pendentes.length > 0) {
        let atual = pendentes.shift();

        let componentes = (atual === "∅") ? [] : atual.split("_");
        transAFD[atual] = {};

        alfabeto.forEach(simbolo => {
            let destino = new Set();

            componentes.forEach(st => {
                transicoes.forEach(t => {

                    if (t[2] === st && t[1] === simbolo) {
                        t[0].forEach(x => destino.add(x));
                    }
                });
            });

            let nomeDestino = nomeiaSubconjunto([...destino]);
            transAFD[atual][simbolo] = nomeDestino;

            if (nomeDestino !== "∅" && !estadosAFD.includes(nomeDestino)) {
                estadosAFD.push(nomeDestino);
                pendentes.push(nomeDestino);
            }
        });
    }

    quintupla_estados = estadosAFD;
    quintupla_alfabeto = alfabeto;
    quintupla_inicial = inicialAFD;
    quintupla_finais = estadosAFD.filter(st =>
        st.split("_").some(x => estados_finais.includes(x))
    );

    preencherTabelaAFD(estadosAFD, transAFD);
    desenharAFD(estadosAFD, transAFD);
}

function preencherTabelaAFD(estadosAFD, transAFD) {
    const tabela = document.querySelector("#tabelaAFD tbody");
    const thead = document.querySelector("#tabelaAFD thead");

    tabela.innerHTML = "";
    thead.innerHTML = "";

    const linhaCab = document.createElement("tr");

    const thDelta = document.createElement("th");
    thDelta.textContent = "δ";
    thDelta.style.width = "2rem";
    linhaCab.appendChild(thDelta);

    alfabeto.forEach(simbolo => {
        const th = document.createElement("th");
        th.textContent = simbolo;
        linhaCab.appendChild(th);
    });

    thead.appendChild(linhaCab);

    estadosAFD.forEach(estado => {
        const tr = tabela.insertRow();

        const thEstado = document.createElement("th");
        thEstado.textContent = estado;
        tr.appendChild(thEstado);

        alfabeto.forEach(simbolo => {
            const td = tr.insertCell();
            td.textContent = (transAFD[estado] && transAFD[estado][simbolo]) ? transAFD[estado][simbolo] : "∅";
        });
    });
}

function desenharAFD(estadosAFD, transAFD) {
    const estados_backup = [...estados];
    const estados_pos_backup = estados_pos.map(x => [...x]);
    const transicoes_backup = transicoes.map(x => [Array.isArray(x[0])? [...x[0]] : x[0], x[1], x[2]]);
    const finais_backup = [...estados_finais];

    try {
        estados = [...estadosAFD];
        estados_pos = [];

        const estados_finais_AFD = estadosAFD.filter(sub =>
            sub.split("_").some(x => finais_backup.includes(x))
        );
        estados_finais = [...estados_finais_AFD];

        desenhaEstados("tela_AFD");

        transicoes = [];
        estadosAFD.forEach(origem => {
            alfabeto.forEach(simbolo => {
                let destino = (transAFD[origem] && transAFD[origem][simbolo]) ? transAFD[origem][simbolo] : "∅";

                if (!destino || destino === "∅") return;

                let destinosArr = destino.split("_");
                transicoes.push([destinosArr, simbolo, origem]);
            });
        });

        desenhaTransicao("tela_AFD");
    } finally {
        estados = estados_backup;
        estados_pos = estados_pos_backup;
        transicoes = transicoes_backup;
        estados_finais = finais_backup;
    }
}

function getInfoTable() {
    const tabTransicao = document.getElementById("tabelaDelta");
    let linhaCabec = tabTransicao.rows[0];

    transicoes = [];

    for (var i = 1, row; row = tabTransicao.rows[i]; i++) {
        for (var j = 1, col; col = linhaCabec.cells[j]; j++) {
            transicoes.push([row.cells[j].textContent.split(","), col.textContent, row.cells[0].textContent]);
        }
    }
}

function printaValidade() {
    let input = document.getElementById("cadeia");
    if (!(input.value.length > 0)) {
        return;
    }

    valText = document.getElementById("validadeText");
    if (validaCadeia()) {
        valText.textContent = "Válido!"
        valText.style.color = 'green'
    } else {
        valText.textContent = "Inválido!"
        valText.style.color = 'red'
    }
}

function transicao() {
    var telaNAO = document.getElementById("tela_AFN");
    var telaDET = document.getElementById("tela_AFD");

    var tabelaNAO = document.getElementById("tableNO");
    var tabelaDET = document.getElementById("tableDET");
    if (telaNAO.classList.contains("hidden")) {
        telaNAO.className = "canvasAFN";
        telaDET.className = "hidden";

        document.getElementById("Botao").innerHTML = "Gerar AFD";

        tabelaNAO.className = "tabelaAFN"
        tabelaDET.className = "thidden"
        
    } else if (telaDET.classList.contains("hidden")) {
        telaDET.className = "canvasAFD";
        telaNAO.className = "hidden";

        document.getElementById("Botao").innerHTML = "Retornar AFN";

        tabelaNAO.className = "thidden"
        tabelaDET.className = "tabelaAFD"
    }
}