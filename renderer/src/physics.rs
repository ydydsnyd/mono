use rapier3d::{
    na::{Const, OPoint},
    prelude::*,
};
use serde::{Deserialize, Serialize};
mod hulls;

#[derive(Serialize, Deserialize)]
pub struct PhysicsState {
    pub islands: IslandManager,
    pub broad_phase: BroadPhase,
    pub narrow_phase: NarrowPhase,
    pub bodies: RigidBodySet,
    pub colliders: ColliderSet,
    pub joints: ImpulseJointSet,
    pub ccd_solver: CCDSolver,
    pub query_pipeline: Option<QueryPipeline>,
    pub integration_parameters: IntegrationParameters,
    pub gravity: Vector<f32>,
}

pub struct Handles {
    a: RigidBodyHandle,
    l: RigidBodyHandle,
    i: RigidBodyHandle,
    v: RigidBodyHandle,
    e: RigidBodyHandle,
}

pub fn run_physics(mut state: PhysicsState, handles: Handles, step: usize) -> PhysicsState {
    let mut physics_pipeline = PhysicsPipeline::new();
    let mut multibody_joint_set = MultibodyJointSet::new();
    let physics_hooks = ();
    let event_handler = ();
    for _ in 0..step {
        physics_pipeline.step(
            &state.gravity,
            &state.integration_parameters,
            &mut state.islands,
            &mut state.broad_phase,
            &mut state.narrow_phase,
            &mut state.bodies,
            &mut state.colliders,
            &mut state.joints,
            &mut multibody_joint_set,
            &mut state.ccd_solver,
            // TODO: do we ever need to init from state.query_pipeline?
            None,
            &physics_hooks,
            &event_handler,
        );
    }
    state
}

pub fn generate_physics(step: usize) -> PhysicsState {
    let (state, handles) = init_state();
    run_physics(state, handles, step)
}

pub fn init_state() -> (PhysicsState, Handles) {
    let gravity = vector![0.0, -9.81, 0.0];
    let integration_parameters = IntegrationParameters::default();
    let islands = IslandManager::new();
    let broad_phase = BroadPhase::new();
    let narrow_phase = NarrowPhase::new();
    let joints = ImpulseJointSet::new();
    let ccd_solver = CCDSolver::new();
    let mut bodies = RigidBodySet::new();
    let mut colliders = ColliderSet::new();

    let a_body = RigidBodyBuilder::dynamic()
        .translation(vector![hulls::A_POS.x, hulls::A_POS.y, 0.0])
        .build();
    let l_body = RigidBodyBuilder::dynamic()
        .translation(vector![hulls::L_POS.x, hulls::L_POS.y, 0.0])
        .build();
    let i_body = RigidBodyBuilder::dynamic()
        .translation(vector![hulls::I_POS.x, hulls::I_POS.y, 0.0])
        .build();
    let v_body = RigidBodyBuilder::dynamic()
        .translation(vector![hulls::V_POS.x, hulls::V_POS.y, 0.0])
        .build();
    let e_body = RigidBodyBuilder::dynamic()
        .translation(vector![hulls::E_POS.x, hulls::E_POS.y, 0.0])
        .build();

    let handles = Handles {
        a: bodies.insert(a_body),
        l: bodies.insert(l_body),
        i: bodies.insert(i_body),
        v: bodies.insert(v_body),
        e: bodies.insert(e_body),
    };

    for hull in hulls::A_HULLS {
        let mut points: Vec<OPoint<f32, Const<3>>> = vec![];
        for idx in (0..hull.len()).step_by(3) {
            points.push([hull[idx], hull[idx + 1], hull[idx + 2]].into());
        }
        let collider = ColliderBuilder::convex_hull(&points[..]).expect("Invalid hull for A");
        colliders.insert_with_parent(collider, handles.a, &mut bodies);
    }

    (
        PhysicsState {
            gravity,
            integration_parameters,
            islands,
            broad_phase,
            narrow_phase,
            joints,
            colliders,
            ccd_solver,
            bodies,
            query_pipeline: None,
        },
        handles,
    )
}
