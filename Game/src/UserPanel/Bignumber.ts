class Bignumber {
    public upNumber: number = 0;

    public downNumber: number = 0;

    public static fold: number = 1;
    public constructor() { }
    public setNumber(num: number) {
        if (num > Bignumber.fold) {
            var s = Math.floor(num / Bignumber.fold);
            this.upNumber = s;
            s = num % Bignumber.fold;
            this.downNumber = s;
        } else {
            this.downNumber = num;
        }
    }
    public setBigNumber(bignum: Bignumber) {
        this.upNumber = bignum.upNumber;
        this.downNumber = bignum.downNumber;
    }
    public addNumber(num: number) {
        if (num >= Bignumber.fold) {
            var s = Math.floor(num / Bignumber.fold);
            this.upNumber += s;
            s = num % Bignumber.fold;
            this.downNumber += s;
        }
        if (num < Bignumber.fold && num + this.downNumber >= Bignumber.fold) {
            this.upNumber++;
            this.downNumber = this.downNumber + num - Bignumber.fold;
        }
        if (num < Bignumber.fold && num + this.downNumber < Bignumber.fold) {
            this.downNumber = this.downNumber + num;
        }
    }
    public addBigNumber(bignum: Bignumber) {
        this.upNumber += bignum.upNumber;
        this.downNumber += bignum.downNumber;
        if (this.downNumber > Bignumber.fold) {
            var s = Math.floor(this.downNumber / Bignumber.fold);
            this.upNumber += s;
            s = this.downNumber % Bignumber.fold;
            this.downNumber = s;
        }
    }

    public subtractNumber(num: number) {
        var UP = this.upNumber;
        var DOWN = this.downNumber;
        if (num < this.downNumber) {
            this.downNumber -= num;
            return;
        }
        if (num > this.downNumber) {
            this.upNumber -= 1;
            var s = Bignumber.fold + this.downNumber - num;
            for (; this.upNumber > 0 && s < 0; this.upNumber--) {
                s += Bignumber.fold;
            }
            if (s < 0 && this.upNumber <= 0) {
                console.warn("number>this数据不足");
                this.upNumber = UP;
                this.downNumber = DOWN;
                return;
            }
            this.downNumber = s;
        }

    }

    public subtractBigNumber(bignum: Bignumber) {
        if (this.upNumber < bignum.upNumber) {
            console.warn("Bignumber>this数据不足");
            return;
        }
        if (this.downNumber >= bignum.downNumber) {
            this.upNumber -= bignum.upNumber;
            this.downNumber -= bignum.downNumber;
        } else {
            this.upNumber -= bignum.upNumber;
            this.upNumber--;
            this.downNumber += Bignumber.fold;
            this.downNumber -= bignum.downNumber;
        }
    }

    public toString(): string {
        var str = "";
        str = (this.upNumber * Bignumber.fold + this.downNumber).toString();
        return str;
    }

}