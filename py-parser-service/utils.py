import time
import psycopg2

def connect():
    try:
        # пытаемся подключиться к базе данных
        conn = psycopg2.connect(
            dbname="parser",
            user="parser",
            password="parser",
            port="5433",
            host="192.168.43.192",
        )
        return conn
    except:
        # в случае сбоя подключения будет выведено сообщение в STDOUT
        time.sleep(10)
        connect()
        print("Can`t establish connection to database")


def connect_info():
    connection = connect()
    cursor = connection.cursor()

    # Распечатать сведения о PostgreSQL
    print("Информация о сервере PostgreSQL")
    print(connection.get_dsn_parameters(), "\n")
    # Выполнение SQL-запроса
    cursor.execute("SELECT version();")
    # Получить результат
    record = cursor.fetchone()
    print("Вы подключены к - ", record, "\n")

    if connection:
        cursor.close()
        connection.close()
