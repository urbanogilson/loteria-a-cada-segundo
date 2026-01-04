# 🎰 Loteria a Cada Segundo

Um simulador de loteria **100% client-side** que demonstra a probabilidade de ganhar na Mega-Sena brasileira. Um novo sorteio acontece a cada segundo, direto no seu navegador!

Inspirado no projeto [Lottery Every Second](https://github.com/Loeffeldude/lotteryeverysecond/) - mas adaptado para a Mega-Sena brasileira.


### 1. Clone o repositório

```bash
git clone https://github.com/urbanogilson/loteria-a-cada-segundo
cd loteria-a-cada-segundo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute em modo de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:4321

### 4. Build para produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### 5. Preview da build

```bash
npm run preview
```

## 🎮 Como Jogar

1. **Escolha seus números**: Selecione 6 números de 1 a 60, ou use "Surpresinha" para escolha aleatória
2. **Assista os sorteios**: Um novo sorteio acontece automaticamente a cada segundo
3. **Acompanhe seus acertos**: Veja em tempo real quantos números você acertou
4. **Celebre as vitórias**:
   - 🎊 **Quadra** (4 acertos) - 1 em 2.332
   - ⭐ **Quina** (5 acertos) - 1 em 154.518
   - 🏆 **Sena** (6 acertos) - 1 em 50.063.860
5. **Veja suas estatísticas**: Acompanhe total de jogos, vitórias e maior prêmio
6. **Revise o histórico**: Todas as vitórias com 4+ acertos são salvas

## 📊 Entendendo as Probabilidades

Com **1 sorteio por segundo**, você teria que esperar:

- **Quadra**: ~39 minutos
- **Quina**: ~43 horas
- **Sena**: ~1,6 anos de sorteios contínuos

Este simulador torna tangível o quão difícil é ganhar na loteria! 🎲

## 🔒 Privacidade

Todos os dados são armazenados **localmente no seu navegador**. Nenhuma informação é enviada para servidores externos. Você pode:

- Limpar seus dados a qualquer momento (limpando localStorage)
- Jogar completamente offline após o primeiro carregamento
- Não se preocupar com rastreamento ou cookies

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

- Reportar bugs
- Sugerir novas funcionalidades
- Submeter pull requests

## 📝 Licença

MIT - Sinta-se livre para usar este projeto para aprendizado e diversão!

## 🎓 Objetivo Educacional

Este projeto serve como:

- **Demonstração de probabilidade** - Visualize estatísticas em ação
- **Ferramenta educacional** - Ensine sobre chances e aleatoriedade
- **Exemplo de código** - Aprenda Astro, React e Tailwind
- **Conscientização financeira** - Entenda por que loteria não é investimento

---

**Aviso**: Este é um simulador educacional. Não incentivamos o jogo de azar. Jogue com responsabilidade! 🎲