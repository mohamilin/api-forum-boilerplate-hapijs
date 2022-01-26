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
                --AddedThread.test.js   
                --NewThread.test.js     
                --GetThread.test.js              
            --AddedThread.js            # untuk menampung data yang dihasilkan o/ repository setelah memasukkan thread baru
            --GetThread.js              
            --NewThread.js              # untuk menampung data yang akan dimasukkan k DB via repository  
        |--ThreadRepository.js            
    ```
    - NewThread : untuk menampung data yang akan dimasukkan k DB via repository
    - AddedThread : untuk menampung data yang dihasilkan o/ repository setelah memasukkan thread baru. 
        - NewThread.js : menerima 3 parameter (owner, title, body) yang kemudian akan di verifikasi apakah data yang masuk terpenuhi semua? dan apakah jenis data yang masuk sudah berupa string?.
        - AddedThread.js : menerima 3 parameter (id, title, owner) yang kemudian akan di verifikasi apakah data yang masuk terpenuhi semua? dan apakah jenis data yang masuk sudah berupa string?.
    - ThreadRepository : sebagai repository interface yang akan menjalankan 3 fungsi yaitu addThread, verifyAvailableThread, dan getThreadById. 

### Tambahan
1. Karena dalam thread terdapat owner yang mana, berhubungan dengan users maka kita perlu menambahkan suatu function [owner] di dalam UserRepository.js dengan parameter berupa id.
2. Begitu juga pada file UserRepositoryPostgres.js perlu juga dilakukan query untuk menjalankan fungsi owner. Jangan lupa lakukan test terlebih dahulu ya..

### Add Threads Application
1. Kemudian kita lanjut ke folder Applications, tepatnya pada use_case -nya. Dengan membuat folder threads yang akan menampung domains > entities dari threads diatas. Buat file AddThreadUseCase.js pada Application > use_case > threads dan AddThreadUseCase.test.js pada Application > use_case > threads > _test.
    - Skenario test pada AddThreadUseCase.test.js yaitu : test dilakukan ketika request terpenuhi dengan kita lakukan require / import AddThreadUseCase, ThreadRepository, AddedThread, NewThread,dan UserRepository
    - Kemudian didalam file AddThreadUseCase kita cukup import NewThread dengan memberikan 2 parameter didalam constructornya yaitu threadRepository dan userRepository

### Add Threads Infrastructures
1. Dalam layer Infrastructures  kita masuk ke folder repository dan repository > _test dengan membuat file ThreadRepositoryPostgres.js dan ThreadRepositoryPostgres.test.js
    - ThreadRepositoryPostgres.test.js : Kita require / import : ThreadRepository dan AddedThread. Dengan menjadikan ThreadRepository sbg parent dan parameter yang dikirim dalam construcutor yaitu pool dan idGenerator
2. Setelah, kita buat langkah diatas, perlu kita masukkan ke dalam file container.js dengan require / import ThreadRepository, ThreadRepositoryPostgres, dan AddThreadUseCase. 

### Add Threads Interfaces
1. Buat folder threads di dalam Interface > http > api, yang mana didalamnya terdapat 3 file : handler.js, index.js, dan routes.js
2. Didalam file handler.js kita import AddThreadUseCase dengan membuat class ThreadHandler yang mana parameter yang dikirim di dalam constructor berupa container
3. Didalam file routes.js kita berikan :
    ```js
        options: {
            auth: 'api_forum',
        }
    ```
    - karena untuk menambahkan thread / addThread membutuhkan Authentikasi
4. Setelah selesai, kita kembali ke Infrastructures > http > createServe.js dengan mendafrtarkan plugin threads dengan options berupa container. Selanjutkan ke Infrastructures > http > _test buat file threads.test.js. Didalam file ini kita akan lakukan integrasi test pada handler dengan melakukan test pada enpoint nya.

<!-- ### Get Threads Domains
1. Fitur thread selain add juga ada Get. Untuk fungsi get thread dilakukan berdasarkan id nya, sehingga kita perlu entitas untuk menjalankan fungsi ini. Maka, buat file GetThread.js pada folder entities beserta testnya juga dengan nama file GetThread.test.js. Sedangkan didalam ThreadRepository.js cukup dengan fungsi getThreadById. 
2. Dalam file GetThread.js menerima 5 parameter yaitu id, username, title, body, date dalam fungsi this._verifyPayload

### Get Threads Application
1. untuk folder Applications nya, didalam folder use_case => Buat file GetThreadUseCase.js  -->