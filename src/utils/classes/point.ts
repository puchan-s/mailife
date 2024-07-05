// クラスの宣言
export class Point {
    private lat: number;
    private lng: number;

    constructor(lat:number,lng:number) {
        this.lat = lat;
        this.lng = lng;
    }

    setName(lat:number): void {
        this.lat = lat;
    }

    setAge(lng:number): void {
        this.lng = lng;
    }

    setPoint(lat:number,lng:number) {
        this.lat = lat;
        this.lng = lng;
    }
    
    getPoint(){
        return { lat: this.lat, lng: this.lng };
    }

}
