const urlLogo = './src/assets/logo';

export const manifest = {
    name: 'VenexportaApp',
    short_name: 'Venex App',
    description: 'Aplicación Venexporta',
    theme_color: '#fff',
    icons: [
        {
            src: './192.png',
            sizes: '192x192',
            type: 'image/png',
        },
        {
            src: './144.png',
            sizes: '144x144',
            type: 'image/png',
        },
        {
            src: './512.png',
            sizes: '512x512',
            type: 'image/png',
        },
        {
            src: './512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
        },
    ],
    
    "screenshots": [
        
        {
            "src": './capture2.png',
            "type": "image/png",
            "sizes": "1439x760",
            "form_factor": "wide"
        },
        {
            "src": './capture3.png',
            "type": "image/png",
            "sizes": "1439x762",
            
        }
    ]
}