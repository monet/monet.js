describe("An IO monad", function() {	
	var effect = IO(function() {
				console.log("some effect")
				return "effect";
				})
	describe("will have lazy", function() {
		
		it("map function", function() {			
			expect(effect.map(function(b) { return b + " hello"}).run()).toBe("effect hello");
		})		
		it("flatMap function", function() {
			var newEffect = function(b) { 
				console.log("inside flatMap")
				return IO(function() {
					console.log("inside effect")
					return b + "ive flatMap"
				}
			)}
			var flatMapEffect = effect.flatMap(newEffect)
			var bindEffect = effect.bind(newEffect)
			expect(flatMapEffect.run()).toBe("effective flatMap")
			expect(bindEffect.run()).toBe("effective flatMap")
			
		})
	})
	describe("will run the effect", function() {
		it("with run method", function() {
			expect(effect.run()).toBe("effect")
		})
	})
})