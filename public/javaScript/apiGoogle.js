function initMap() {
    // Localização do endereço
    var location = { lat: -22.8441, lng: -43.3011 }; // Coordenadas aproximadas para o endereço fornecido

    // Criar o mapa
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location
    });

    // Adicionar um marcador no mapa
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Av. Brasil, 21779 - Guadalupe, Rio de Janeiro - RJ, 21670-000'
    });
}