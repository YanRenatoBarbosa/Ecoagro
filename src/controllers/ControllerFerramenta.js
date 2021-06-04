import { UncontrolledInput } from "../pages/Ferramenta/UncontrolledInput";
import { ConnectionFactory } from "../services/connectionFactory";
import { converterMedidas } from "../services/converterMedidas";

export class ControllerFerramenta {

  createInputs({ qtdTensiosRasos, qtdTensiosProfundos }) {
    const inputs = [];
    let qtdTotal = parseInt(qtdTensiosRasos) + parseInt(qtdTensiosProfundos);
    let cont = 0;

    const _make = (qtdTotal) => {
      for(cont; cont < qtdTotal; cont++){

        if(cont % 2 === 0){
          //raso 
          inputs.push(<UncontrolledInput prof="Raso" id={cont} key={cont} />)
        } else {
          //prof
          inputs.push(<UncontrolledInput prof="Profundo" id={cont} key={cont} />)
        }
      }
    }

    const _increment = (prof) => {
      for(cont; cont < qtdTotal; cont++){
        inputs.push(<UncontrolledInput prof={prof} id={cont} key={cont} />)
      }
    }

    // qtdEhSimetrica
    if(qtdTensiosRasos === qtdTensiosProfundos) {      
      _make( qtdTotal );
    }

    // qtdRasosEhMaior
    else if(parseInt(qtdTensiosProfundos) < parseInt(qtdTensiosRasos)){
      _make( qtdTensiosProfundos * 2 );
      _increment('Raso');
    }

    // qtdProfsEhMaior
    else {

      console.log('qtdTensiosRasos * 2: ', qtdTensiosRasos * 2 );
      console.log('qtdTotal', qtdTotal);

      _make( qtdTensiosRasos * 2 );
      _increment('Profundo');
    }

    return inputs;
  }


  calcularMedia(event, dados) {
    event.preventDefault();

    let target = event.target;

    const inputs = target.querySelectorAll('input');
    const btnsMedidas = target.querySelectorAll('.btns-container');
    const medidas = target.querySelectorAll('.selected');
    
    converterMedidas( inputs, btnsMedidas, medidas );

    const inputsTensiosRasos = target.querySelectorAll('.InputLeituraRaso');
    const inputsTensiosProfs = target.querySelectorAll('.InputLeituraProfundo');

    //calculando a média de leitura dos tensios em qualquer profundidade
    let contadorMediaGeral = 0;
    inputs.forEach(input => contadorMediaGeral += parseFloat(input.value));
    contadorMediaGeral /= inputs.length;
    
    //calculando a média de leitura dos tensios rasos
    let contadorMediaRasos = 0;
    inputsTensiosRasos.forEach(input => contadorMediaRasos += parseFloat(input.value));
    contadorMediaRasos /= inputsTensiosRasos.length;

    //calculando a média de leitura dos tensios rasos
    let contadorMediaProfs = 0;
    inputsTensiosProfs.forEach(input => contadorMediaProfs += parseFloat(input.value));
    contadorMediaProfs /= inputsTensiosProfs.length;
    

    const resultado = {
      mediaGeral: contadorMediaGeral,
      mediaRasos: contadorMediaRasos,
      mediaProfs: contadorMediaProfs,
      cultura: dados.cultura,
      tipoIrrigacao: dados.tipoIrrigacao,
      tipoSolo: dados.tipoSolo,
    }

    ConnectionFactory.getConnection().then(connection => {
      connection
        .transaction(['analises'], 'readwrite')
        .objectStore('analises')
        .add(resultado);
        
      window.location.pathname = '/resultados';
    });
  }
}
