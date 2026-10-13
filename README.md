# PantiCare

PantiCare adalah aplikasi berbasis web untuk mendukung pengelolaan informasi dan layanan panti.

## Docker Hub

Aplikasi PantiCare dikemas menggunakan Docker dan image-nya telah diunggah ke Docker Hub.

* **Docker Hub Repository:** https://hub.docker.com/r/raisanabila12/panticare
* **Docker Image Tag:** `submit-UTS`

### Mengunduh Docker Image

```bash
docker pull raisanabila12/panticare:submit-UTS
```

### Menjalankan Aplikasi

```bash
docker run --rm -p 3000:3000 raisanabila12/panticare:submit-UTS
```
