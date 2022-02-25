# back_api
Comunicação com dispositivos Zigbee atráves do Node.js
(Lembrando ser necessario a biblioteca zigbee2mqtt)

Iniciando a API, chame a rota get:

> localhost:4000/gettype
Assim gerando o arquivo de tipos, e ela está pronta para uso.

Para listar os dispositivos conectados na rede use get:

> localhost:4000/devices

![image](https://user-images.githubusercontent.com/89494183/155716951-5fcb5076-5cea-41e4-9071-e3d689bce2f0.png)

Para mudar o estado do dispositivo use post:

> localhost:4000/defineTurn

Parâmetros:

![image](https://user-images.githubusercontent.com/89494183/155717365-8fb197b8-2d25-4065-b83c-7b79b91a9815.png)
![image](https://user-images.githubusercontent.com/89494183/155719422-1b536c65-5602-401e-ac95-56777350e22e.png)


Para itens especificos como troca da cor de led use post:

> localhost:4000/defineState

Parâmetros:

![image](https://user-images.githubusercontent.com/89494183/155718350-77021344-e318-48de-9223-31b173d1eea7.png)
![image](https://user-images.githubusercontent.com/89494183/155719493-d87307b0-4158-43ea-a61b-e283a1f0b56d.png)


Para verificar status use post:

> localhost:4000/status

Parâmetros:

![image](https://user-images.githubusercontent.com/89494183/155719208-128b88b7-15d6-4b2b-a8e6-06afc529bbdf.png)

