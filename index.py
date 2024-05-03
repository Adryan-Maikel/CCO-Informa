from flask import Flask, render_template
from gsheets import INFORMATIONS as INFO

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html")


@app.route("/edit/<table>")
def edit_table(table: str) -> str:
    if table == "sheets":
        return render_template("edit.html")
    ROWS = list(enumerate(INFO[table]["get"]()))
    COLS = [table.title()]
    if table == "operadores":
        ROWS = [[_id, *data] for _id, data in enumerate(INFO[table]["get"]())]
        COLS = ["Operadores", "Cracha"]

    return render_template("sheet.html", table=table.title(),
                           rows=ROWS, cols=COLS)


if __name__ == "__main__":
    app.run()
