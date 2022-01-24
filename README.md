#  Dokumentasi
## Threads
### Add Threads Domains
1. kita mulai dengan melakukan membuat table threads : npm run migrate create_table_threads
2. Lakukan helper test pada file test dengan membuat file ThreadsTableTestHelper.js
3. CATATAN : Buatlah terlebih dahulu testnya, sebagai skenario code nya agar kita dapat menerapkan TDD
4. Kemudian, kita beranjak ke Domains.
   1. Buat folder dengan structur spt ini :
   ```
    threads\
        |--_test
        |    --ThreadRepository.test.js
        |--entities
            --_test
                --AddedThread.test.js   # untuk menampung data yang dihasilkan o/ repository setelah memasukkan thread baru
                --NewThread.test.js     # untuk menampung data yang akan dimasukkan k DB via repository
            --AddedThread.js              
            --NewThread.js                 
        |--ThreadRepository.js            
    ```
    - NewThread : untuk menampung data yang akan dimasukkan k DB via repository
    - AddedThread : untuk menampung data yang dihasilkan o/ repository setelah memasukkan thread baru. 
        - NewThread.js : menerima 3 parameter (owner, title, body) yang kemudian akan di verifikasi apakah data yang masuk terpenuhi semua? dan apakah jenis data yang masuk sudah berupa string?.
        - AddedThread.js : menerima 3 parameter (id, title, owner) yang kemudian akan di verifikasi apakah data yang masuk terpenuhi semua? dan apakah jenis data yang masuk sudah berupa string?.
    - ThreadRepository : sebagai repository interface yang akan menjalankan 3 fungsi yaitu addThread, verifyAvailableThread, dan getThreadById. 

### Tambahan
1. Karena dalam thread terdapat owner yang mana, berhubungan dengan users maka kita perlu menambahkan suatu function [owner] di dalam UserRepository.js dengan parameter berupa id.

### Add Threads Application
1. Kemudian kita lanjut ke folder Applications, tepatnya pada use_case -nya. Dengan membuat folder threads yang akan menampung domains > entities dari threads diatas. Buat file AddThreadUseCase.js pada Application > use_case > threads dan AddThreadUseCase.test.js pada Application > use_case > threads > _test.
    - Skenario test pada AddThreadUseCase.test.js yaitu : test dilakukan ketika request terpenuhi dengan kita lakukan require / import AddThreadUseCase, ThreadRepository, AddedThread, NewThread,dan UserRepository
    - Kemudian didalam file AddThreadUseCase kita cukup import NewThread dengan memberikan 2 parameter didalam constructornya yaitu threadRepository dan userRepository
